import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";
import initializeDatabase from "./init-db.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder automatically
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(
    cors({
        origin: [
            "https://online-order-system-qxpz0c4ip-amplemind.vercel.app",
            "https://online-order-system-98rp.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

// Middleware
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    }
});

// Home route
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.json({
            success: true,
            message: "Database connected successfully!",
            database: rows
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });
    }
});

// Add product to cart
app.post("/api/cart", async (req, res) => {
    try {
        const { product_name, product_price, quantity } = req.body;

        const price = Number(product_price);
        const qty = Number(quantity);

        if (
            typeof product_name !== "string" ||
            !product_name.trim() ||
            product_price === undefined ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(qty) ||
            qty <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid product name, price, and quantity."
            });
        }

        const totalPrice = Number((price * qty).toFixed(2));

        const sql = `
            INSERT INTO cart_items
            (product_name, product_price, quantity, total_price)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            product_name.trim(),
            price,
            qty,
            totalPrice
        ]);

        res.status(201).json({
            success: true,
            message: "Product added to cart successfully!",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add to cart error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add product to cart.",
            error: error.message
        });
    }
});

// Get cart items
app.get("/api/cart", async (req, res) => {
    try {
        const [items] = await db.query(
            "SELECT * FROM cart_items ORDER BY id DESC"
        );

        res.json({
            success: true,
            items
        });
    } catch (error) {
        console.error("Fetch cart error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart items.",
            error: error.message
        });
    }
});

// GET all products from MySQL
app.get("/api/products", async (req, res) => {
    try {
        const [products] = await db.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            count: products.length,
            message: "Products fetched successfully!",
            products: products
        });

    } catch (error) {
        console.error("Fetch products error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products from database.",
            error: error.message
        });
    }
});

// Add product to database, including image upload
app.post("/api/products", (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            console.error("Image upload error:", error);

            return res.status(400).json({
                success: false,
                message: error.message || "Image upload failed."
            });
        }

        next();
    });
}, async (req, res) => {
    try {
        const { name, price } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Product name is required."
            });
        }

        if (
            price === undefined ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid product price."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a product image."
            });
        }

        const productPrice = Number(price);
        const imagePath = `/uploads/${req.file.filename}`;

        // Check your products table structure if this query fails.
        const sql = `
            INSERT INTO products (name, price, image_path)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            name.trim(),
            productPrice,
            imagePath
        ]);

        return res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: {
                id: result.insertId,
                name: name.trim(),
                price: productPrice,
                image_path: imagePath
            }
        });
    } catch (error) {
        console.error("Add product database error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to database.",
            error: error.message
        });
    }
});

// Return JSON for any unhandled errors
app.use((error, req, res, next) => {
    console.error("Unhandled backend error:", error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({
        success: false,
        message: error.message || "Internal server error."
    });
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();