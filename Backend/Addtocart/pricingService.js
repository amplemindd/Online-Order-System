const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export async function calculatePricing(connection, items, couponCode = null) {
  const [[settings]] = await connection.query("SELECT * FROM pricing_settings WHERE id = 1");
  if (!settings) throw new Error("Pricing settings are not initialized.");

  const subtotal = round2(items.reduce((sum, item) => sum + Number(item.subtotal), 0));
  let productTax = 0;
  const pricedItems = items.map((item) => {
    const rate = clamp(Number(item.gst_rate || 0), 0, 100);
    const gross = Number(item.subtotal);
    const inclusive = Number(item.tax_inclusive) === 1;
    const tax = rate === 0 ? 0 : (inclusive ? gross - gross / (1 + rate / 100) : gross * rate / 100);
    productTax += tax;
    return {
      productId: item.productId, name: item.productName, quantity: item.quantity,
      unitPrice: item.price, lineSubtotal: round2(gross),
      hsnCode: item.hsn_code || null, gstRate: rate,
      taxInclusive: inclusive, productTax: round2(tax)
    };
  });
  productTax = round2(productTax);

  let coupon = null;
  let couponDiscount = 0;
  if (couponCode) {
    const code = String(couponCode).trim().toUpperCase();
    const [rows] = await connection.execute(
      "SELECT * FROM coupons WHERE code = ? FOR UPDATE", [code]
    );
    if (!rows.length) throw new Error("Invalid coupon code.");
    coupon = rows[0];
    const now = new Date();
    if (!Number(coupon.is_active)) throw new Error("This coupon is inactive.");
    if (coupon.starts_at && new Date(coupon.starts_at) > now) throw new Error("This coupon is not active yet.");
    if (coupon.expires_at && new Date(coupon.expires_at) < now) throw new Error("This coupon has expired.");
    if (coupon.usage_limit !== null && Number(coupon.used_count) >= Number(coupon.usage_limit)) {
      throw new Error("This coupon has reached its usage limit.");
    }
    if (subtotal < Number(coupon.min_cart_value)) throw new Error(`Minimum cart value for this coupon is ₹${coupon.min_cart_value}.`);
    couponDiscount = coupon.discount_type === "percent"
      ? subtotal * Number(coupon.discount_value) / 100
      : Number(coupon.discount_value);
    if (coupon.max_discount !== null) couponDiscount = Math.min(couponDiscount, Number(coupon.max_discount));
    couponDiscount = round2(clamp(couponDiscount, 0, subtotal));
  }

  const deliveryFee = subtotal >= Number(settings.free_delivery_threshold)
    ? 0 : Number(settings.delivery_fee);
  const smallCartFee = Number(settings.small_cart_threshold) > 0 && subtotal < Number(settings.small_cart_threshold)
    ? Number(settings.small_cart_fee) : 0;
  const handlingFee = Number(settings.handling_fee);
  const platformFee = Number(settings.platform_fee);
  const serviceFeeBase = deliveryFee + smallCartFee + handlingFee + platformFee;
  const serviceFeeTax = Number(settings.service_fee_gst_enabled)
    ? round2(serviceFeeBase * Number(settings.service_fee_gst_rate) / 100) : 0;

  // Inclusive GST is already inside product prices. Exclusive GST is added to payable.
  const exclusiveProductTax = round2(items.reduce((sum, item) => {
    const rate = Number(item.gst_rate || 0);
    return sum + (Number(item.tax_inclusive) === 1 || !rate ? 0 : Number(item.subtotal) * rate / 100);
  }, 0));

  const beforeRounding = round2(subtotal - couponDiscount + serviceFeeBase + serviceFeeTax + exclusiveProductTax);
  const grandTotal = Math.round(beforeRounding);
  const roundingAdjustment = round2(grandTotal - beforeRounding);

  return {
    currency: "INR",
    items: pricedItems,
    subtotal,
    productTax,
    productTaxAdded: exclusiveProductTax,
    coupon: coupon ? { code: coupon.code, type: coupon.discount_type, value: Number(coupon.discount_value) } : null,
    couponDiscount,
    deliveryFee: round2(deliveryFee),
    smallCartFee: round2(smallCartFee),
    handlingFee: round2(handlingFee),
    platformFee: round2(platformFee),
    serviceFeeTax,
    roundingAdjustment,
    grandTotal: round2(grandTotal)
  };
}

export async function savePricingSnapshot(connection, orderId, userId, pricing, couponId = null) {
  const breakdown = JSON.stringify(pricing);
  await connection.execute(
    `INSERT INTO order_pricing_snapshots
      (order_id, subtotal, product_discount, coupon_code, coupon_discount,
       delivery_fee, small_cart_fee, handling_fee, platform_fee, product_tax,
       service_fee_tax, rounding_adjustment, grand_total, breakdown)
     VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, pricing.subtotal, pricing.coupon?.code || null, pricing.couponDiscount,
      pricing.deliveryFee, pricing.smallCartFee, pricing.handlingFee, pricing.platformFee,
      pricing.productTax, pricing.serviceFeeTax, pricing.roundingAdjustment,
      pricing.grandTotal, breakdown]
  );
  if (couponId && pricing.coupon) {
    await connection.execute(
      "INSERT INTO coupon_redemptions (coupon_id, order_id, user_id, discount_amount) VALUES (?, ?, ?, ?)",
      [couponId, orderId, userId, pricing.couponDiscount]
    );
    await connection.execute("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [couponId]);
  }
}
