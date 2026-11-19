import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import db from "./db.js";
import initializeDatabase from "./init-db.js";
import jwt from "jsonwebtoken";
import {
    authenticateToken,
    authorizeRoles
} from "./authMiddleware.js";
import orderRoutes from "./orderRoutes.js"

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

const allowedOrigins = [
  "https://online-order-system-exotak4fr-amplemind.vercel.app",
  "https://online-order-system-qxpz0c4ip-amplemind.vercel.app",
  "https://online-order-system-ir33vlojp-amplemind.vercel.app",
  "https://online-order-system-98rp.onrender.com",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-to-server requests.
    if (!origin) return callback(null, true);

    // Allow explicitly listed origins and this project's Vercel preview deployments.
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/online-order-system-[a-z0-9]+-amplemind\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware
app.use(express.json());
app.use("/uploads", express.static(uploadDir));
app.use("/api", orderRoutes);

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

// GET all products with category names
app.get("/api/products", async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                p.*,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.id
            ORDER BY p.id DESC
        `);

        res.status(200).json({
            success: true,
            count: products.length,
            message: "Products fetched successfully!",
            products
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


app.post(
  "/api/products",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        stock,
        pricingType,
        description,
      } = req.body;

      if (!name?.trim() || !category?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name and category are required.",
        });
      }

      const parsedPrice = Number(price);
      const parsedStock = Number(stock ?? 0);

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid product price.",
        });
      }

      if (
        !Number.isInteger(parsedStock) ||
        parsedStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number.",
        });
      }

      const allowedPricingTypes = [
        "Per Kg",
        "Per Piece",
        "Per Litre",
        "Per Pack",
      ];

      const selectedPricingType = pricingType || "Per Kg";

      if (!allowedPricingTypes.includes(selectedPricingType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pricing type.",
        });
      }

      // Find existing category or create a new one
      const [existingCategories] = await db.query(
        "SELECT id FROM categories WHERE name = ?",
        [category.trim()]
      );

      let categoryId;

      if (existingCategories.length > 0) {
        categoryId = existingCategories[0].id;
      } else {
        const [categoryResult] = await db.query(
          "INSERT INTO categories (name) VALUES (?)",
          [category.trim()]
        );

        categoryId = categoryResult.insertId;
      }

      const imagePath = req.file
        ? `uploads/${req.file.filename}`
        : null;

      const [result] = await db.query(
        `INSERT INTO products
          (category_id, name, price, image_path, description, stock, pricing_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          name.trim(),
          parsedPrice,
          imagePath,
          description || "",
          parsedStock,
          selectedPricingType,
        ]
      );

      res.status(201).json({
        success: true,
        message: "Product added successfully.",
        productId: result.insertId,
      });
    } catch (error) {
      console.error("Add product error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to add product.",
      });
    }
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const productId = Number(req.params.id);

      if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const [existing] = await db.query(
        "SELECT id FROM products WHERE id = ?",
        [productId]
      );

      if (!existing.length) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      // Keep products referenced by previous orders
      const [usedInOrders] = await db.query(
        "SELECT id FROM order_items WHERE product_id = ? LIMIT 1",
        [productId]
      );

      if (usedInOrders.length) {
        return res.status(409).json({
          success: false,
          message:
            "This product is part of an existing order and cannot be deleted.",
        });
      }

      await db.query("DELETE FROM products WHERE id = ?", [productId]);

      res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete product.",
      });
    }
  }
);


app.get(
  "/api/admin/dashboard-stats",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const [[productStats]] = await db.query(`
        SELECT COUNT(*) AS totalProducts
        FROM products
      `);

      const [[orderStats]] = await db.query(`
        SELECT
          COUNT(*) AS totalOrders,
          COALESCE(
            SUM(
              CASE
                WHEN payment_status = 'paid' OR status = 'paid'
                THEN total_amount
                ELSE 0
              END
            ),
            0
          ) AS totalRevenue
        FROM orders
      `);

      const [[customerStats]] = await db.query(`
        SELECT COUNT(*) AS totalCustomers
        FROM users
        WHERE role = 'user'
      `);

      const [recentOrders] = await db.query(`
        SELECT
          id,
          customer_name,
          total_amount,
          status,
          payment_status,
          created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 5
      `);

      const [topProducts] = await db.query(`
        SELECT
          p.id,
          p.name,
          p.price,
          p.image_path,
          COALESCE(SUM(oi.quantity), 0) AS total_sold
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        LEFT JOIN orders o ON o.id = oi.order_id
          AND (o.payment_status = 'paid' OR o.status = 'paid')
        GROUP BY p.id, p.name, p.price, p.image_path
        ORDER BY total_sold DESC
        LIMIT 5
      `);

      res.json({
        success: true,
        totalProducts: Number(productStats.totalProducts),
        totalOrders: Number(orderStats.totalOrders),
        totalCustomers: Number(customerStats.totalCustomers),
        totalRevenue: Number(orderStats.totalRevenue),
        recentOrders,
        topProducts,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to load dashboard statistics.",
      });
    }
  }
);


// USER REGISTRATION API
app.post("/api/register", async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password
        } = req.body;

        const firstName = (first_name || "").trim();
        const lastName = (last_name || "").trim();
        const cleanEmail = (email || "").trim().toLowerCase();

        // Required field validation
        if (!firstName || !lastName || !cleanEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Name validation
        if (
            !/^[A-Za-z ]+$/.test(firstName) ||
            !/^[A-Za-z ]+$/.test(lastName)
        ) {
            return res.status(400).json({
                success: false,
                message: "Names must contain only letters."
            });
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Password validation
        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.execute(
            `INSERT INTO users
            (first_name, last_name, email, password)
            VALUES (?, ?, ?, ?)`,
            [firstName, lastName, cleanEmail, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful!",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
});

// USER LOGIN API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const cleanEmail = (email || "").trim().toLowerCase();

        // Validate input
        if (!cleanEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Check JWT configuration
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment.");
            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured."
            });
        }

        // Find user
        const [users] = await db.execute(
            `SELECT id, first_name, last_name, email, password, role
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [cleanEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
});


// GET LOGGED-IN USER PROFILE
app.get("/api/user/profile", authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT id, first_name, last_name, email, role, created_at
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch user profile."
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