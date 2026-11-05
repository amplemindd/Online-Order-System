
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173"
    ]
}));

app.use(express.json());

// MySQL Connection
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "shopping_db"
});

// Test backend and database
app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({
            success: true,
            message: "Backend and MySQL connected!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// ADD PRODUCT TO CART
app.post("/api/cart", async (req, res) => {
    try {
        const {
            session_id,
            product_name,
            product_price,
            quantity
        } = req.body;

        if (
            !session_id ||
            !product_name ||
            product_price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const price = Number(product_price);
        const qty = Number(quantity);

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(qty) ||
            price <= 0 ||
            qty <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter valid price and quantity"
            });
        }

        const total = price * qty;

        await db.query(
            `INSERT INTO cart
            (session_id, product_name, product_price, quantity, total_price)
            VALUES (?, ?, ?, ?, ?)`,
            [
                session_id,
                product_name,
                price,
                qty,
                total
            ]
        );

        res.json({
            success: true,
            message: "Product added to cart successfully!"
        });

    } catch (error) {
        console.error("Add cart error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add product"
        });
    }
});

// GET CART ITEMS
app.get("/api/cart/:session_id", async (req, res) => {
    try {
        const { session_id } = req.params;

        const [items] = await db.query(
            `SELECT * FROM cart WHERE session_id = ? ORDER BY id DESC`,
            [session_id]
        );

        res.json({
            success: true,
            items: items
        });

    } catch (error) {
        console.error("Get cart error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch cart"
        });
    }
});

// DELETE CART ITEM
app.delete("/api/cart/:id", async (req, res) => {
    try {
        await db.query(
            "DELETE FROM cart WHERE id = ?",
            [req.params.id]
        );

        res.json({
            success: true,
            message: "Product removed"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
});

// START SERVER
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
