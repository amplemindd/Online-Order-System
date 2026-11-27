import db from "./db.js";

async function addColumnIfMissing(tableName, columnName, definition) {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  if (!rows.length) {
    await db.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
  }
}

export async function initializePricingDatabase() {
  // Per-product tax metadata. Existing products remain valid with 0% until configured.
  await addColumnIfMissing("products", "hsn_code", "VARCHAR(30) NULL");
  await addColumnIfMissing("products", "gst_rate", "DECIMAL(5,2) NOT NULL DEFAULT 0");
  await addColumnIfMissing("products", "tax_inclusive", "TINYINT(1) NOT NULL DEFAULT 1");

  await db.query(`
    CREATE TABLE IF NOT EXISTS pricing_settings (
      id TINYINT PRIMARY KEY,
      free_delivery_threshold DECIMAL(10,2) NOT NULL DEFAULT 499,
      delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 30,
      small_cart_threshold DECIMAL(10,2) NOT NULL DEFAULT 0,
      small_cart_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      handling_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      service_fee_gst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
      service_fee_gst_enabled TINYINT(1) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await db.query(`INSERT IGNORE INTO pricing_settings (id) VALUES (1)`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(40) NOT NULL UNIQUE,
      discount_type ENUM('percent','fixed') NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      min_cart_value DECIMAL(10,2) NOT NULL DEFAULT 0,
      max_discount DECIMAL(10,2) NULL,
      usage_limit INT NULL,
      used_count INT NOT NULL DEFAULT 0,
      starts_at DATETIME NULL,
      expires_at DATETIME NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_pricing_snapshots (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL UNIQUE,
      currency VARCHAR(3) NOT NULL DEFAULT 'INR',
      subtotal DECIMAL(10,2) NOT NULL,
      product_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      coupon_code VARCHAR(40) NULL,
      coupon_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      small_cart_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      handling_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      product_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
      service_fee_tax DECIMAL(10,2) NOT NULL DEFAULT 0,
      rounding_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
      grand_total DECIMAL(10,2) NOT NULL,
      breakdown JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_order_pricing_snapshot_order FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS coupon_redemptions (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      coupon_id INT NOT NULL,
      order_id INT NOT NULL,
      user_id INT NOT NULL,
      discount_amount DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_coupon_order (coupon_id, order_id),
      INDEX idx_coupon_user (coupon_id, user_id),
      CONSTRAINT fk_coupon_redemption_coupon FOREIGN KEY (coupon_id)
        REFERENCES coupons(id) ON DELETE RESTRICT,
      CONSTRAINT fk_coupon_redemption_order FOREIGN KEY (order_id)
        REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
}
