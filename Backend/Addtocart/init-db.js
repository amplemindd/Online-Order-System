import db from "./db.js";

async function initializeDatabase() {
    try {
        // 1. Categories Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Products Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NULL,
                name VARCHAR(150) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                image_path VARCHAR(255) NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id)
                    REFERENCES categories(id)
                    ON DELETE SET NULL
            )
        `);

        // 3. Orders Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(150) NOT NULL,
                customer_email VARCHAR(150),
                customer_phone VARCHAR(20),
                total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
                status VARCHAR(30) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. Order Items Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id)
                    REFERENCES orders(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (product_id)
                    REFERENCES products(id)
            )
        `);

        console.log("All database tables created successfully!");

    } catch (error) {
        console.error("Table creation failed:", error.message);
        throw error;
    }
}

export default initializeDatabase;