import express from "express";
import crypto from "crypto";
import db from "./db.js";
import { authenticateToken, authorizeRoles } from "./authMiddleware.js";
import { calculatePricing, savePricingSnapshot } from "./pricingService.js";

const router = express.Router();

const money = (value) => Number(Number(value).toFixed(2));

function validateCustomer(customer = {}) {
  const required = ["email", "lastName", "address", "city", "state", "postalCode", "phone"];
  for (const key of required) {
    if (!String(customer[key] || "").trim()) {
      return `Please provide ${key}.`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return "Please enter a valid email address.";
  }
  if (!/^\d{6}$/.test(String(customer.postalCode).trim())) {
    return "Please enter a valid 6-digit PIN code.";
  }
  return null;
}

/*
 * Never trust client-submitted prices or totals.
 * Cart rows must contain product id and positive integer quantity.
 * Product price/name/image are read from MySQL.
 */
async function createOrderRows(connection, userId, customer, items, paymentMethod, couponCode = null) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }
  if (items.length > 50) throw new Error("Too many cart items.");

  const productIds = items.map((item) => Number(item.id));
  if (productIds.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error("One or more cart products are invalid.");
  }

  const normalized = [];
  let total = 0;

  for (const item of items) {
    const productId = Number(item.id);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Invalid product quantity.");
    }

    const [products] = await connection.execute(
      "SELECT id, name, price, image_path, stock, hsn_code, gst_rate, tax_inclusive FROM products WHERE id = ? FOR UPDATE",
      [productId]
    );
    if (!products.length) throw new Error(`Product ${productId} is no longer available.`);

    const product = products[0];
    if (product.stock !== null && Number(product.stock) < quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const price = money(product.price);
    const subtotal = money(price * quantity);

    normalized.push({
      productId,
      productName: product.name,
      imagePath: product.image_path,
      quantity,
      price,
      subtotal,
      hsn_code: product.hsn_code,
      gst_rate: product.gst_rate,
      tax_inclusive: product.tax_inclusive,
      size: item.size ? String(item.size).slice(0, 50) : null,
      color: item.color ? String(item.color).slice(0, 50) : null,
    });
  }

  const pricing = await calculatePricing(connection, normalized, couponCode || customer.couponCode || null);
  total = pricing.grandTotal;

  const customerName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
  const [orderResult] = await connection.execute(
    `INSERT INTO orders
      (user_id, customer_name, customer_email, customer_phone, total_amount,
       status, payment_status, payment_method, currency, address, apartment,
       city, state, postal_code, country)
     VALUES (?, ?, ?, ?, ?, 'pending', 'pending', ?, 'INR', ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      customerName,
      customer.email.trim().toLowerCase(),
      customer.phone.trim(),
      total,
      paymentMethod,
      customer.address.trim(),
      customer.apartment?.trim() || null,
      customer.city.trim(),
      customer.state.trim(),
      customer.postalCode.trim(),
      customer.country?.trim() || "India",
    ]
  );

  const orderId = orderResult.insertId;

  for (const item of normalized) {
    await connection.execute(
      `INSERT INTO order_items
        (order_id, product_id, quantity, price, subtotal,
         product_name, product_size, product_color, image_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, item.productId, item.quantity, item.price, item.subtotal,
        item.productName, item.size, item.color, item.imagePath,
      ]
    );
  }

  const couponId = pricing.coupon?.code
    ? (await connection.execute("SELECT id FROM coupons WHERE code = ? FOR UPDATE", [pricing.coupon.code]))[0][0]?.id
    : null;
  await savePricingSnapshot(connection, orderId, userId, pricing, couponId);
  return { orderId, total, pricing };
}

router.post("/orders/cod", authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { customer, items, couponCode } = req.body || {};
    const validationError = validateCustomer(customer);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    await connection.beginTransaction();
    const order = await createOrderRows(connection, req.user.id, customer, items, "cod", couponCode);
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Your COD order has been placed.",
      orderId: order.orderId,
      total: order.total,
      pricing: order.pricing,
      currency: "INR",
      paymentStatus: "pending",
    });
  } catch (error) {
    await connection.rollback();
    console.error("COD order error:", error);
    return res.status(400).json({ success: false, message: error.message || "Unable to place order." });
  } finally {
    connection.release();
  }
});

router.post("/payments/razorpay/order", authenticateToken, async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(503).json({ success: false, message: "Razorpay is not configured. Add API keys to the backend environment." });
  }

  const connection = await db.getConnection();
  try {
    const { customer, items, couponCode } = req.body || {};
    const validationError = validateCustomer(customer);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    await connection.beginTransaction();
    const order = await createOrderRows(connection, req.user.id, customer, items, "razorpay", couponCode);
    const receipt = `gb_${order.orderId}`;

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(order.total * 100),
        currency: "INR",
        receipt,
        notes: { greenbee_order_id: String(order.orderId) },
      }),
    });

    const razorpayOrder = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      throw new Error(razorpayOrder.error?.description || "Could not create Razorpay order.");
    }

    await connection.execute(
      "UPDATE orders SET payment_order_id = ? WHERE id = ?",
      [razorpayOrder.id, order.orderId]
    );
    await connection.execute(
      `INSERT INTO payments (order_id, provider, provider_order_id, amount, currency, status)
       VALUES (?, 'razorpay', ?, ?, 'INR', 'created')`,
      [order.orderId, razorpayOrder.id, order.total]
    );
    await connection.commit();

    return res.status(201).json({
      success: true,
      orderId: order.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      pricing: order.pricing,
      currency: "INR",
      keyId,
      customer: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        email: customer.email,
        contact: customer.phone,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Razorpay order creation error:", error);
    return res.status(400).json({ success: false, message: error.message || "Unable to start payment." });
  } finally {
    connection.release();
  }
});

router.post("/payments/razorpay/verify", authenticateToken, async (req, res) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return res.status(503).json({ success: false, message: "Razorpay is not configured." });

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment verification details." });
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(razorpay_signature));
  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(400).json({ success: false, message: "Payment signature verification failed." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [orders] = await connection.execute(
      "SELECT id, user_id, payment_order_id, payment_status FROM orders WHERE id = ? FOR UPDATE",
      [Number(orderId)]
    );

    if (!orders.length || Number(orders[0].user_id) !== Number(req.user.id)) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (orders[0].payment_order_id !== razorpay_order_id) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Payment order does not match." });
    }
    if (orders[0].payment_status === "paid") {
      await connection.commit();
      return res.json({ success: true, message: "Payment already verified.", orderId: Number(orderId) });
    }

    await connection.execute(
      `UPDATE orders
       SET payment_id = ?, payment_signature = ?, payment_status = 'paid', status = 'placed'
       WHERE id = ?`,
      [razorpay_payment_id, razorpay_signature, Number(orderId)]
    );
    await connection.execute(
      `UPDATE payments
       SET provider_payment_id = ?, status = 'paid'
       WHERE order_id = ? AND provider_order_id = ?`,
      [razorpay_payment_id, Number(orderId), razorpay_order_id]
    );
    await connection.commit();

    return res.json({ success: true, message: "Payment verified and order placed.", orderId: Number(orderId) });
  } catch (error) {
    await connection.rollback();
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: "Unable to verify payment." });
  } finally {
    connection.release();
  }
});

// CUSTOMER: Get logged-in user's orders
router.get("/orders/my-orders", authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT
        id,
        total_amount,
        status,
        payment_status,
        payment_method,
        currency,
        created_at,
        address,
        apartment,
        city,
        state,
        postal_code,
        country
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Customer orders fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders."
    });
  }
});


// CUSTOMER: Get details of one of their orders
router.get("/orders/my-orders/:id", authenticateToken, async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID."
      });
    }

    const [orders] = await db.execute(
      `SELECT *
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    const [items] = await db.execute(
      `SELECT
        oi.product_id,
        COALESCE(oi.product_name, p.name) AS product_name,
        oi.quantity,
        oi.price,
        oi.subtotal,
        oi.product_size,
        oi.product_color,
        COALESCE(oi.image_path, p.image_path) AS image_path
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const [[pricingSnapshot]] = await db.execute(
      "SELECT breakdown FROM order_pricing_snapshots WHERE order_id = ?", [orderId]
    );
    return res.json({
      success: true,
      order: orders[0],
      items,
      pricing: pricingSnapshot ? JSON.parse(pricingSnapshot.breakdown) : null
    });
  } catch (error) {
    console.error("Customer order detail error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details."
    });
  }
});

router.get("/admin/orders", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT id, user_id, customer_name, customer_email, customer_phone,
              total_amount, status, payment_status, payment_method, currency,
              created_at, city, state, postal_code
       FROM orders ORDER BY created_at DESC`
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch orders." });
  }
});

router.get("/admin/orders/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const [orders] = await db.execute("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (!orders.length) return res.status(404).json({ success: false, message: "Order not found." });

    const [items] = await db.query(
  `SELECT
      oi.product_id,
      COALESCE(oi.product_name, p.name) AS product_name,
      oi.quantity,
      oi.price,
      oi.subtotal,
      oi.product_size,
      oi.product_color,
      COALESCE(oi.image_path, p.image_path) AS image_path
   FROM order_items oi
   LEFT JOIN products p ON p.id = oi.product_id
   WHERE oi.order_id = ?`,
  [orderId]
);
    const [[pricingSnapshot]] = await db.execute(
      "SELECT breakdown FROM order_pricing_snapshots WHERE order_id = ?", [orderId]
    );
    res.json({
      success: true, order: orders[0], items,
      pricing: pricingSnapshot ? JSON.parse(pricingSnapshot.breakdown) : null
    });
  } catch (error) {
    console.error("Admin order detail error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch order details." });
  }
});

router.put("/admin/orders/:id/status", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const allowed = ["pending", "placed", "processing", "shipped", "delivered", "cancelled"];
  const status = String(req.body?.status || "").toLowerCase();
  if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid order status." });

  try {
    const [result] = await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, message: "Order status updated." });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ success: false, message: "Unable to update order status." });
  }
});

export default router;
