import db from "./db.js";

async function columnExists(tableName, columnName) {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return rows.length > 0;
}

async function addColumnIfMissing(tableName, columnName, definition) {
  const exists = await columnExists(tableName, columnName);

  if (!exists) {
    await db.query(
      `ALTER TABLE \`${tableName}\`
       ADD COLUMN \`${columnName}\` ${definition}`
    );

    console.log(`Added column: ${tableName}.${columnName}`);
  }
}

async function initializeDatabase() {
  try {
    // Categories
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NULL,
        name VARCHAR(150) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_path VARCHAR(255) NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE SET NULL
      )
    `);

    // Safe migrations for existing products table
    await addColumnIfMissing(
      "products",
      "stock",
      "INT NOT NULL DEFAULT 0"
    );

    await addColumnIfMissing(
      "products",
      "pricing_type",
      "VARCHAR(30) NOT NULL DEFAULT 'Per Kg'"
    );

    // Orders
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        customer_email VARCHAR(150),
        customer_phone VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safe payment fields for existing orders table
    await addColumnIfMissing(
      "orders",
      "payment_order_id",
      "VARCHAR(100) NULL"
    );

    await addColumnIfMissing(
      "orders",
      "payment_id",
      "VARCHAR(100) NULL"
    );

    await addColumnIfMissing(
      "orders",
      "payment_status",
      "VARCHAR(30) NOT NULL DEFAULT 'pending'"
    );

    // Order items
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id)
          REFERENCES orders(id)
          ON DELETE CASCADE,
        FOREIGN KEY (product_id)
          REFERENCES products(id)
      )
    `);

    // Users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // After your existing payment_status migration on orders:
 await addColumnIfMissing("orders", "user_id", "INT NULL");
 await addColumnIfMissing("orders", "address", "VARCHAR(255) NULL");
 await addColumnIfMissing("orders", "apartment", "VARCHAR(150) NULL");
 await addColumnIfMissing("orders", "city", "VARCHAR(100) NULL");
 await addColumnIfMissing("orders", "state", "VARCHAR(100) NULL");
 await addColumnIfMissing("orders", "postal_code", "VARCHAR(20) NULL");
 await addColumnIfMissing("orders", "country", "VARCHAR(80) NOT NULL DEFAULT 'India'");
 await addColumnIfMissing("orders", "payment_method", "VARCHAR(30) NULL");
 await addColumnIfMissing("orders", "currency", "VARCHAR(3) NOT NULL DEFAULT 'INR'");
 await addColumnIfMissing("orders", "payment_signature", "VARCHAR(255) NULL");

 // After your existing order_items CREATE TABLE:
 await addColumnIfMissing("order_items", "product_name", "VARCHAR(150) NULL");
 await addColumnIfMissing("order_items", "product_size", "VARCHAR(50) NULL");
 await addColumnIfMissing("order_items", "product_color", "VARCHAR(50) NULL");
 await addColumnIfMissing("order_items", "image_path", "VARCHAR(255) NULL");

 // After your existing users CREATE TABLE:
 // user_id is intentionally nullable for compatibility with any historical orders.
 // Add an index only if it does not already exist.
 const [userOrderIndex] = await db.query(
   `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'orders'
      AND INDEX_NAME = 'idx_orders_user_id'`
 );
 if (!userOrderIndex.length) {
   await db.query("CREATE INDEX idx_orders_user_id ON orders(user_id)");
 }

 // Payment attempts / provider references:
 await db.query(`
   CREATE TABLE IF NOT EXISTS payments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     order_id INT NOT NULL,
     provider VARCHAR(30) NOT NULL,
     provider_order_id VARCHAR(100) NULL,
     provider_payment_id VARCHAR(100) NULL,
     amount DECIMAL(10,2) NOT NULL,
     currency VARCHAR(3) NOT NULL DEFAULT 'INR',
     status VARCHAR(30) NOT NULL DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_payments_order_id (order_id),
     CONSTRAINT fk_payments_order
       FOREIGN KEY (order_id) REFERENCES orders(id)
       ON DELETE CASCADE
   )
 `);


    // Contact messages
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


// Account-wise carts
await db.query(`
  CREATE TABLE IF NOT EXISTS user_carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_carts_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  )
`);

// Cart items
await db.query(`
  CREATE TABLE IF NOT EXISTS user_cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    product_size VARCHAR(50) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_cart_product_size
      (cart_id, product_id, product_size),

    CONSTRAINT fk_user_cart_items_cart
      FOREIGN KEY (cart_id)
      REFERENCES user_carts(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_user_cart_items_product
      FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON DELETE CASCADE
  )
`);

// Saved customer addresses
await db.query(`
  CREATE TABLE IF NOT EXISTS user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    apartment VARCHAR(150) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(80) NOT NULL DEFAULT 'India',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_addresses_user_id (user_id),

    CONSTRAINT fk_user_addresses_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  )
`);



    console.log("Database tables and migrations completed.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export default initializeDatabase;