import express from "express";
import db from "./db.js";
import { authenticateToken, authorizeRoles } from "./authMiddleware.js";
import { calculatePricing } from "./pricingService.js";

const router = express.Router();
const adminOnly = [authenticateToken, authorizeRoles("admin")];

router.get("/admin/pricing/settings", ...adminOnly, async (_req, res) => {
  try {
    const [[settings]] = await db.query("SELECT * FROM pricing_settings WHERE id = 1");
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load pricing settings." });
  }
});

router.put("/admin/pricing/settings", ...adminOnly, async (req, res) => {
  const fields = [
    "free_delivery_threshold", "delivery_fee", "small_cart_threshold", "small_cart_fee",
    "handling_fee", "platform_fee", "service_fee_gst_rate"
  ];
  const values = fields.map((key) => Number(req.body?.[key]));
  if (values.some((v) => !Number.isFinite(v) || v < 0) ||
      values[6] > 100) {
    return res.status(400).json({ success: false, message: "Enter valid non-negative pricing values." });
  }
  const enabled = req.body?.service_fee_gst_enabled ? 1 : 0;
  try {
    await db.execute(
      `UPDATE pricing_settings SET
       free_delivery_threshold=?, delivery_fee=?, small_cart_threshold=?, small_cart_fee=?,
       handling_fee=?, platform_fee=?, service_fee_gst_rate=?, service_fee_gst_enabled=?
       WHERE id=1`,
      [...values, enabled]
    );
    const [[settings]] = await db.query("SELECT * FROM pricing_settings WHERE id=1");
    res.json({ success: true, settings, message: "Pricing settings saved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to save pricing settings." });
  }
});

router.get("/admin/pricing/products", ...adminOnly, async (_req, res) => {
  try {
    const [products] = await db.query(
      "SELECT id, name, price, hsn_code, gst_rate, tax_inclusive FROM products ORDER BY name"
    );
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load product tax settings." });
  }
});

router.put("/admin/pricing/products/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const hsn = req.body?.hsn_code ? String(req.body.hsn_code).trim().slice(0, 30) : null;
  const rate = Number(req.body?.gst_rate);
  const inclusive = req.body?.tax_inclusive ? 1 : 0;
  if (!Number.isInteger(id) || id < 1 || !Number.isFinite(rate) || rate < 0 || rate > 100) {
    return res.status(400).json({ success: false, message: "Invalid product tax details." });
  }
  try {
    const [result] = await db.execute(
      "UPDATE products SET hsn_code=?, gst_rate=?, tax_inclusive=? WHERE id=?",
      [hsn, rate, inclusive, id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, message: "Product tax settings saved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to save product tax settings." });
  }
});

router.get("/admin/pricing/coupons", ...adminOnly, async (_req, res) => {
  try {
    const [coupons] = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load coupons." });
  }
});

router.post("/admin/pricing/coupons", ...adminOnly, async (req, res) => {
  const code = String(req.body?.code || "").trim().toUpperCase();
  const type = req.body?.discount_type;
  const value = Number(req.body?.discount_value);
  const min = Number(req.body?.min_cart_value || 0);
  const max = req.body?.max_discount === "" || req.body?.max_discount == null ? null : Number(req.body.max_discount);
  const limit = req.body?.usage_limit === "" || req.body?.usage_limit == null ? null : Number(req.body.usage_limit);
  if (!/^[A-Z0-9_-]{3,40}$/.test(code) || !["percent", "fixed"].includes(type) ||
      !Number.isFinite(value) || value <= 0 || (type === "percent" && value > 100) ||
      !Number.isFinite(min) || min < 0 ||
      (max !== null && (!Number.isFinite(max) || max < 0)) ||
      (limit !== null && (!Number.isInteger(limit) || limit < 1))) {
    return res.status(400).json({ success: false, message: "Please enter valid coupon details." });
  }
  try {
    await db.execute(
      `INSERT INTO coupons (code, discount_type, discount_value, min_cart_value, max_discount, usage_limit, starts_at, expires_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, type, value, min, max, limit, req.body.starts_at || null, req.body.expires_at || null, req.body.is_active === false ? 0 : 1]
    );
    res.status(201).json({ success: true, message: "Coupon created." });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      success: false, message: error.code === "ER_DUP_ENTRY" ? "Coupon code already exists." : "Unable to create coupon."
    });
  }
});

router.put("/admin/pricing/coupons/:id", ...adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  const active = req.body?.is_active ? 1 : 0;
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Invalid coupon." });
  try {
    const [result] = await db.execute("UPDATE coupons SET is_active=? WHERE id=?", [active, id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.json({ success: true, message: "Coupon status updated." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update coupon." });
  }
});

router.post("/pricing/calculate", authenticateToken, async (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || !items.length || items.length > 50) {
    return res.status(400).json({ success: false, message: "Cart items are required." });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const ids = items.map((item) => Number(item.id));
    if (ids.some((id) => !Number.isInteger(id) || id < 1)) throw new Error("Invalid cart product.");
    const normalized = [];
    for (const item of items) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) throw new Error("Invalid product quantity.");
      const [[p]] = await connection.execute(
        "SELECT id, name, price, gst_rate, tax_inclusive, hsn_code FROM products WHERE id=?",
        [Number(item.id)]
      );
      if (!p) throw new Error("A cart product is no longer available.");
      normalized.push({
        productId: p.id, productName: p.name, price: Number(p.price), quantity: qty,
        subtotal: Number(p.price) * qty, gst_rate: p.gst_rate,
        tax_inclusive: p.tax_inclusive, hsn_code: p.hsn_code
      });
    }
    const pricing = await calculatePricing(connection, normalized, req.body?.couponCode || null);
    await connection.commit();
    res.json({ success: true, pricing });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ success: false, message: error.message || "Unable to calculate pricing." });
  } finally {
    connection.release();
  }
});

export default router;
