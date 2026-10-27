
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

// Test whether the backend is running
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

// Add a product to the cart
app.post("/api/cart", (req, res) => {
    const { product_name, product_price, quantity } = req.body;

    if (
        typeof product_name !== "string" ||
        !product_name.trim() ||
        !Number.isFinite(product_price) ||
        product_price < 0 ||
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isInteger(Math.round(quantity * 1000))
    ) {
        return res.status(400).json({
            message: "Please provide valid product details."
        });
    }

    const total_price = product_price * quantity;

    const sql = `
        INSERT INTO cart_items
        (product_name, product_price, quantity, total_price)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [product_name.trim(), product_price, quantity, total_price],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to add product to cart."
                });
            }

            res.status(201).json({
                message: "Product added to cart successfully!",
                id: result.insertId,
                product_name,
                product_price,
                quantity,
                total_price
            });
        }
    );
});

// Get all cart items
app.get("/api/cart", (req, res) => {
    db.query("SELECT * FROM cart_items ORDER BY id DESC", (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch cart items."
            });
        }

        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});