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
import orderRoutes from "./orderRoutes.js";
import pricingRoutes from "./pricingRoutes.js";
import { initializePricingDatabase } from "./pricingDb.js";
import addressRoutes from "./addressRoutes.js";

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

// Allowed frontend origins
const allowedOrigins = [
    "https://online-order-system-exotak4fr-amplemind.vercel.app",
    "https://online-order-system-qxpz0c4ip-amplemind.vercel.app",
    "https://online-order-system-ir33vlojp-amplemind.vercel.app",
    "https://online-order-system-xi.vercel.app",
    "https://online-order-system-98rp.onrender.com",
    "http://localhost:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

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
app.use("/api", pricingRoutes);
app.use("/api", addressRoutes);

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

// Check the exact database and products-table columns used by this backend.
app.get("/api/check-database", async (req, res) => {
    try {
        const [databaseRows] = await db.query("SELECT DATABASE() AS database_name");
        const [columns] = await db.query("SHOW COLUMNS FROM products");

        return res.json({
            success: true,
            database: databaseRows[0]?.database_name || null,
            productColumns: columns.map((column) => column.Field)
        });
    } catch (error) {
        console.error("Database diagnostic error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to inspect the connected database.",
            error: error.message
        });
    }
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

// ==========================================
// ACCOUNT-WISE CART APIs
// ==========================================

// Get or create logged-in user's cart
async function getOrCreateUserCart(userId) {
  await db.execute(
    `INSERT INTO user_carts (user_id)
     VALUES (?)
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    [userId]
  );

  const [rows] = await db.execute(
    "SELECT id FROM user_carts WHERE user_id = ?",
    [userId]
  );

  return rows[0].id;
}

// GET: Logged-in user's cart
app.get("/api/cart", authenticateToken, async (req, res) => {
  try {
    const cartId = await getOrCreateUserCart(req.user.id);

    const [items] = await db.execute(
      `SELECT
         ci.id AS cart_item_id,
         ci.product_id,
         ci.quantity,
         ci.product_size AS size,
         p.name,
         p.price,
         p.image_path,
         p.pricing_type
       FROM user_cart_items ci
       INNER JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?
       ORDER BY ci.id DESC`,
      [cartId]
    );

    res.json({
      success: true,
      items
    });

  } catch (error) {
    console.error("Fetch user cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart."
    });
  }
});

// POST: Add product to logged-in user's cart
app.post("/api/cart", authenticateToken, async (req, res) => {
  try {
    const productId = Number(req.body.product_id);
    const quantity = Number(req.body.quantity ?? 1);
    const size = String(req.body.size ?? "").trim();

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity."
      });
    }

    const [products] = await db.execute(
      "SELECT id FROM products WHERE id = ?",
      [productId]
    );

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    const cartId = await getOrCreateUserCart(req.user.id);

    await db.execute(
      `INSERT INTO user_cart_items
       (cart_id, product_id, quantity, product_size)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       quantity = quantity + VALUES(quantity)`,
      [cartId, productId, quantity, size]
    );

    res.status(201).json({
      success: true,
      message: "Product added to your cart."
    });

  } catch (error) {
    console.error("Add user cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart."
    });
  }
});

// PUT: Update quantity of a cart item
app.put("/api/cart/:itemId", authenticateToken, async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    const quantity = Number(req.body.quantity);

    if (
      !Number.isInteger(itemId) ||
      itemId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item or quantity."
      });
    }

    const [result] = await db.execute(
      `UPDATE user_cart_items ci
       INNER JOIN user_carts c ON c.id = ci.cart_id
       SET ci.quantity = ?
       WHERE ci.id = ? AND c.user_id = ?`,
      [quantity, itemId, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found."
      });
    }

    res.json({
      success: true,
      message: "Cart quantity updated."
    });

  } catch (error) {
    console.error("Update cart quantity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quantity."
    });
  }
});

// DELETE: Remove a cart item
app.delete("/api/cart/:itemId", authenticateToken, async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);

    const [result] = await db.execute(
      `DELETE ci FROM user_cart_items ci
       INNER JOIN user_carts c ON c.id = ci.cart_id
       WHERE ci.id = ? AND c.user_id = ?`,
      [itemId, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found."
      });
    }

    res.json({
      success: true,
      message: "Product removed from cart."
    });

  } catch (error) {
    console.error("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove cart item."
    });
  }
});

// DELETE: Clear only logged-in user's cart
app.delete("/api/cart", authenticateToken, async (req, res) => {
  try {
    const [carts] = await db.execute(
      "SELECT id FROM user_carts WHERE user_id = ?",
      [req.user.id]
    );

    if (carts.length) {
      await db.execute(
        "DELETE FROM user_cart_items WHERE cart_id = ?",
        [carts[0].id]
      );
    }

    res.json({
      success: true,
      message: "Your cart has been cleared."
    });

  } catch (error) {
    console.error("Clear user cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart."
    });
  }
});

// GET all products with category names
app.get("/api/products", async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT
                p.*,
                c.name AS category,
                p.image_path AS image_url,
                p.pricing_type AS pricingType,

                (COALESCE(p.mrp, p.price) - p.price)
                AS discount_amount,

                CASE
                    WHEN COALESCE(p.mrp, 0) > 0
                    THEN ROUND(
                        ((p.mrp - p.price) / p.mrp) * 100,
                        0
                    )
                    ELSE 0
                END AS discount_percentage

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
            message: "Failed to fetch products.",
            error: error.message
        });
    }
});

// ADD PRODUCT
app.post(
    "/api/products",
    authenticateToken,
    authorizeRoles("admin"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                mrp,
                stock,
                pricingType,
                description,
                goodFor,
                topNutrients,
                netQuantity,
                shelfLife
            } = req.body;

            if (!name?.trim() || !category?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Product name and category are required."
                });
            }

            const currentPrice = Number(price);
            const mrpPrice = Number(mrp);
            const parsedStock = Number(stock ?? 0);

            if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid current price."
                });
            }

            if (!Number.isFinite(mrpPrice) || mrpPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid MRP."
                });
            }

            if (mrpPrice < currentPrice) {
                return res.status(400).json({
                    success: false,
                    message: "MRP cannot be less than current price."
                });
            }

            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Stock must be a non-negative whole number."
                });
            }

            const allowedPricingTypes = [
                "Per Kg",
                "Per Piece",
                "Per Litre",
                "Per Pack"
            ];

            const selectedPricingType = pricingType || "Per Kg";

            if (!allowedPricingTypes.includes(selectedPricingType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid pricing type."
                });
            }

            // Get or create category
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

            // Get uploaded image paths
            const files = req.files || {};

            const coverImage = files.image?.[0]
                ? `uploads/${files.image[0].filename}`
                : null;

            const image2 = files.image2?.[0]
                ? `uploads/${files.image2[0].filename}`
                : null;

            const image3 = files.image3?.[0]
                ? `uploads/${files.image3[0].filename}`
                : null;

            // Save product
            const [result] = await db.query(
                `INSERT INTO products
                (
                    category_id,
                    category,
                    name,
                    price,
                    mrp,
                    image_path,
                    image_2,
                    image_3,
                    description,
                    stock,
                    pricingType,
                    good_for,
                    top_nutrients,
                    net_quantity,
                    shelf_life
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    categoryId,
                    category.trim(),
                    name.trim(),
                    currentPrice,
                    mrpPrice,
                    coverImage,
                    image2,
                    image3,
                    description || "",
                    parsedStock,
                    selectedPricingType,
                    goodFor || "",
                    topNutrients || "",
                    netQuantity || "",
                    shelfLife || ""
                ]
            );

            res.status(201).json({
                success: true,
                message: "Product added successfully.",
                productId: result.insertId,
                discount: {
                    amount: Number((mrpPrice - currentPrice).toFixed(2)),
                    percentage: Math.round(
                        ((mrpPrice - currentPrice) / mrpPrice) * 100
                    )
                }
            });

        } catch (error) {
            console.error("Add product error:", error);

            res.status(500).json({
                success: false,
                message: "Failed to add product.",
                error: error.message
            });
        }
    }
);


// UPDATE PRODUCT
app.put(
    "/api/products/:id",
    authenticateToken,
    authorizeRoles("admin"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const productId = Number(req.params.id);

            if (!Number.isInteger(productId) || productId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID."
                });
            }

            const {
                name,
                category,
                price,
                mrp,
                stock,
                pricingType,
                description,
                goodFor,
                topNutrients,
                netQuantity,
                shelfLife
            } = req.body;

            if (!name?.trim() || !category?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Product name and category are required."
                });
            }

            const currentPrice = Number(price);
            const mrpPrice = Number(mrp);
            const parsedStock = Number(stock ?? 0);

            if (
                !Number.isFinite(currentPrice) ||
                currentPrice <= 0 ||
                !Number.isFinite(mrpPrice) ||
                mrpPrice <= 0 ||
                mrpPrice < currentPrice
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter valid MRP and current price. MRP cannot be less than current price."
                });
            }

            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Stock must be a non-negative whole number."
                });
            }

            const allowedPricingTypes = [
                "Per Kg",
                "Per Piece",
                "Per Litre",
                "Per Pack"
            ];

            const selectedPricingType = pricingType || "Per Kg";

            if (!allowedPricingTypes.includes(selectedPricingType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid pricing type."
                });
            }

            const [existingProducts] = await db.query(
    `SELECT id, image_path, image_2, image_3
     FROM products
     WHERE id = ?`,
    [productId]
);

            if (existingProducts.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found."
                });
            }

            // Get or create category
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

            const oldProduct = existingProducts[0];
const files = req.files || {};

const coverImage = files.image?.[0]
    ? `uploads/${files.image[0].filename}`
    : oldProduct.image_path;

const image2 = files.image2?.[0]
    ? `uploads/${files.image2[0].filename}`
    : oldProduct.image_2;

const image3 = files.image3?.[0]
    ? `uploads/${files.image3[0].filename}`
    : oldProduct.image_3;

            await db.query(
    `UPDATE products SET
        category_id = ?,
        name = ?,
        price = ?,
        mrp = ?,
        image_path = ?,
        image_2 = ?,
        image_3 = ?,
        description = ?,
        stock = ?,
        pricing_type = ?,
        good_for = ?,
        top_nutrients = ?,
        net_quantity = ?,
        shelf_life = ?
     WHERE id = ?`,
    [
        categoryId,
        name.trim(),
        currentPrice,
        mrpPrice,
        coverImage,
        image2,
        image3,
        description || "",
        parsedStock,
        selectedPricingType,
        goodFor || "",
        topNutrients || "",
        netQuantity || "",
        shelfLife || "",
        productId
    ]
);

            res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                productId
            });

        } catch (error) {
            console.error("Update product error:", error);

            res.status(500).json({
                success: false,
                message: "Failed to update product.",
                error: error.message
            });
        }
    }
);


// Delete product
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

// Update product availability
app.put(
    "/api/products/:id/status",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const productId = Number(req.params.id);
            const { is_active } = req.body;

            if (!Number.isInteger(productId) || productId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID"
                });
            }

            if (![0, 1].includes(Number(is_active))) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status"
                });
            }

            // Check whether the optional availability column exists in this database.
            const [statusColumns] = await db.query("SHOW COLUMNS FROM products LIKE 'is_active'");

            if (statusColumns.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Product status is not configured. Run: ALTER TABLE products ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;"
                });
            }

            const [result] = await db.query(
                "UPDATE products SET is_active = ? WHERE id = ?",
                [Number(is_active), productId]
            );

            if (result.affectedRows === 0) {
                const [existingProduct] = await db.query(
                    "SELECT id FROM products WHERE id = ?",
                    [productId]
                );

                if (existingProduct.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Product not found"
                    });
                }
            }

            res.json({
                success: true,
                message: "Product availability updated"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to update availability"
            });
        }
    }
);

// Admin dashboard statistics
app.get(
    "/api/admin/dashboard-stats",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const period = ["week", "month", "year"].includes(req.query.period)
                ? req.query.period
                : "month";

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
                                WHEN LOWER(COALESCE(payment_status, '')) = 'paid'
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

            // Count orders by their actual status
            const [orderStatusRows] = await db.query(`
                SELECT
                    LOWER(COALESCE(status, 'pending')) AS status,
                    COUNT(*) AS total
                FROM orders
                GROUP BY LOWER(COALESCE(status, 'pending'))
            `);

            const orderStatusCounts = {};
            orderStatusRows.forEach((row) => {
                orderStatusCounts[row.status] = Number(row.total);
            });

            // Select date range and grouping for sales chart
            let dateCondition;
            let labelFormat;
            let groupExpression;

            if (period === "week") {
                dateCondition = `
                    created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                    AND created_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                `;
                labelFormat = "%a";
                groupExpression = "DATE(created_at)";
            } else if (period === "year") {
                dateCondition = `
                    created_at >= MAKEDATE(YEAR(CURDATE()), 1)
                    AND created_at < MAKEDATE(YEAR(CURDATE()) + 1, 1)
                `;
                labelFormat = "%b";
                groupExpression = "YEAR(created_at), MONTH(created_at)";
            } else {
                dateCondition = `
                    created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                    AND created_at < DATE_ADD(
                        LAST_DAY(CURDATE()),
                        INTERVAL 1 DAY
                    )
                `;
                labelFormat = "%d";
                groupExpression = "DATE(created_at)";
            }

            const [salesOverview] = await db.query(`
                SELECT
                    DATE_FORMAT(MIN(created_at), '${labelFormat}') AS label,
                    COALESCE(SUM(total_amount), 0) AS revenue
                FROM orders
                WHERE LOWER(COALESCE(payment_status, '')) = 'paid'
                    AND ${dateCondition}
                GROUP BY ${groupExpression}
                ORDER BY MIN(created_at) ASC
            `);

            // Only count products from paid orders
            const [topProducts] = await db.query(`
                SELECT
    p.id,
    p.name,
    p.price,
    p.image_path,
    COALESCE(sold.total_sold, 0) AS total_sold
FROM products p
LEFT JOIN (
    SELECT
        oi.product_id,
        SUM(oi.quantity) AS total_sold
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE LOWER(COALESCE(o.payment_status, '')) = 'paid'
    GROUP BY oi.product_id
) sold ON sold.product_id = p.id
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
                orderStatusCounts,
                salesOverview: salesOverview.map((item) => ({
                    label: item.label,
                    revenue: Number(item.revenue),
                })),
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

// ==========================================
// CATEGORY MANAGEMENT APIs
// ==========================================

// GET all categories with product count and image
app.get("/api/categories", async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT
                c.id,
                c.name,
                c.description,
                c.image_path,
                c.created_at,
                COUNT(p.id) AS product_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            GROUP BY
                c.id, c.name, c.description, c.image_path, c.created_at
            ORDER BY c.id DESC
        `);

        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Fetch categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories.",
            error: error.message
        });
    }
});

// POST - Add new category with optional image
app.post(
    "/api/categories",
    authenticateToken,
    authorizeRoles("admin"),
    upload.single("image"),
    async (req, res) => {
        try {
            const name = typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";
            const description = typeof req.body.description === "string"
                ? req.body.description.trim()
                : "";

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Category name is required."
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Category name must be 100 characters or fewer."
                });
            }

            const imagePath = req.file
                ? `uploads/${req.file.filename}`
                : null;

            const [result] = await db.query(
                `INSERT INTO categories (name, description, image_path)
                 VALUES (?, ?, ?)`,
                [name, description || null, imagePath]
            );

            return res.status(201).json({
                success: true,
                message: "Category added successfully.",
                categoryId: result.insertId,
                image_path: imagePath
            });
        } catch (error) {
            console.error("Add category error:", error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "A category with this name already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to add category.",
                error: error.message
            });
        }
    }
);

// PUT - Update category and optionally replace its image
app.put(
    "/api/categories/:id",
    authenticateToken,
    authorizeRoles("admin"),
    upload.single("image"),
    async (req, res) => {
        try {
            const categoryId = Number(req.params.id);
            const name = typeof req.body.name === "string"
                ? req.body.name.trim()
                : "";
            const description = typeof req.body.description === "string"
                ? req.body.description.trim()
                : "";

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID."
                });
            }

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Category name is required."
                });
            }

            if (name.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Category name must be 100 characters or fewer."
                });
            }

            const [existing] = await db.query(
                "SELECT id, image_path FROM categories WHERE id = ?",
                [categoryId]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found."
                });
            }

            // Keep old image when no replacement image is uploaded.
            const imagePath = req.file
                ? `uploads/${req.file.filename}`
                : existing[0].image_path;

            await db.query(
                `UPDATE categories
                 SET name = ?, description = ?, image_path = ?
                 WHERE id = ?`,
                [name, description || null, imagePath, categoryId]
            );

            return res.status(200).json({
                success: true,
                message: "Category updated successfully.",
                image_path: imagePath
            });
        } catch (error) {
            console.error("Update category error:", error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "A category with this name already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to update category.",
                error: error.message
            });
        }
    }
);

// DELETE - Delete category only when no products are linked
app.delete(
    "/api/categories/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const categoryId = Number(req.params.id);

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID."
                });
            }

            const [existing] = await db.query(
                "SELECT id FROM categories WHERE id = ?",
                [categoryId]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found."
                });
            }

            const [products] = await db.query(
                "SELECT COUNT(*) AS total FROM products WHERE category_id = ?",
                [categoryId]
            );

            if (Number(products[0].total) > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Cannot delete this category because products are linked to it."
                });
            }

            await db.query(
                "DELETE FROM categories WHERE id = ?",
                [categoryId]
            );

            return res.status(200).json({
                success: true,
                message: "Category deleted successfully."
            });
        } catch (error) {
            console.error("Delete category error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to delete category.",
                error: error.message
            });
        }
    }
);

// ADMIN: GET ALL REGISTERED CUSTOMERS
app.get(
    "/api/admin/customers",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const [customers] = await db.query(`
                SELECT
                    id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    created_at
                FROM users
                WHERE role = 'user'
                ORDER BY created_at DESC, id DESC
            `);

            return res.status(200).json({
                success: true,
                count: customers.length,
                customers
            });

        } catch (error) {
            console.error("Fetch customers error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch customers."
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
            phone,
            password
        } = req.body;

        const firstName = (first_name || "").trim();
        const lastName = (last_name || "").trim();
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPhone = (phone || "").trim();

        if (!firstName || !lastName || !cleanEmail || !cleanPhone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (
            !/^[A-Za-z ]+$/.test(firstName) ||
            !/^[A-Za-z ]+$/.test(lastName)
        ) {
            return res.status(400).json({
                success: false,
                message: "Names must contain only letters."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number."
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `INSERT INTO users
            (first_name, last_name, email, phone, password)
            VALUES (?, ?, ?, ?, ?)`,
            [firstName, lastName, cleanEmail, cleanPhone, hashedPassword]
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

        if (!cleanEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment.");
            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured."
            });
        }

        const [users] = await db.execute(
    `SELECT id, first_name, last_name, email, phone, password, role
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
    phone: user.phone,
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
    `SELECT id, first_name, last_name, email, phone, role, created_at
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


// ---------------- RIDER MANAGEMENT + LIVE TRACKING ----------------
// Run the supplied rider-migration.sql before using these endpoints.

// Admin: list rider profiles with latest GPS point and activity summary.
app.get("/api/admin/riders", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [riders] = await db.query(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
             rp.status, rp.vehicle_type, rp.license_number,
             loc.latitude, loc.longitude, loc.accuracy, loc.recorded_at AS location_updated_at,
             (SELECT COUNT(*) FROM rider_activities ra WHERE ra.rider_id = u.id) AS activity_count
      FROM users u
      INNER JOIN rider_profiles rp ON rp.user_id = u.id
      LEFT JOIN rider_locations loc ON loc.id = (
        SELECT rl.id FROM rider_locations rl WHERE rl.rider_id = u.id
        ORDER BY rl.recorded_at DESC, rl.id DESC LIMIT 1
      )
      WHERE u.role = 'rider'
      ORDER BY u.created_at DESC, u.id DESC
    `);
    res.json({ success: true, riders });
  } catch (error) {
    console.error("Fetch riders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch riders." });
  }
});

// Admin: create a rider login and rider profile.
app.post("/api/admin/riders", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { first_name, last_name, email, phone, password, vehicle_type, license_number } = req.body;
  const firstName = String(first_name || "").trim();
  const lastName = String(last_name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPhone = String(phone || "").trim();
  if (!firstName || !lastName || !cleanEmail || !cleanPhone || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ success: false, message: "Enter rider name, email, phone and a password of at least 8 characters." });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      `INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'rider')`,
      [firstName, lastName, cleanEmail, cleanPhone, hashedPassword]
    );
    await connection.execute(
      `INSERT INTO rider_profiles (user_id, status, vehicle_type, license_number) VALUES (?, 'offline', ?, ?)`,
      [userResult.insertId, vehicle_type || null, license_number || null]
    );
    await connection.commit();
    res.status(201).json({ success: true, message: "Rider created successfully.", riderId: userResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error("Create rider error:", error);
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({ success: false, message: error.code === "ER_DUP_ENTRY" ? "Email already registered." : "Failed to create rider." });
  } finally {
    connection.release();
  }
});

// Admin: change operational status. GPS-derived online/offline should be maintained by the app heartbeat.
app.patch("/api/admin/riders/:id/status", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const allowed = ["available", "on_delivery", "offline"];
  const status = String(req.body.status || "").toLowerCase();
  if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid rider status." });
  try {
    const [result] = await db.execute("UPDATE rider_profiles SET status = ? WHERE user_id = ?", [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Rider not found." });
    res.json({ success: true, message: "Rider status updated." });
  } catch (error) {
    console.error("Update rider status error:", error);
    res.status(500).json({ success: false, message: "Failed to update rider status." });
  }
});

// Admin: rider details and action history.
app.get("/api/admin/riders/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [rows] = await db.execute(`
     SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
       rp.status, rp.vehicle_type, rp.license_number
FROM users u
INNER JOIN rider_profiles rp ON rp.user_id = u.id
WHERE u.id = ? AND u.role = 'rider'
LIMIT 1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Rider not found." });
    const [locations] = await db.execute("SELECT latitude, longitude, accuracy, recorded_at FROM rider_locations WHERE rider_id = ? ORDER BY recorded_at DESC LIMIT 20", [req.params.id]);
    const [activities] = await db.execute("SELECT id, order_id, event_type, description, created_at FROM rider_activities WHERE rider_id = ? ORDER BY created_at DESC LIMIT 100", [req.params.id]);
    res.json({ success: true, rider: rows[0], locations, activities });
  } catch (error) {
    console.error("Fetch rider details error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rider details." });
  }
});

// Rider app: receive a GPS point from the authenticated rider device.
app.post("/api/rider/location", authenticateToken, authorizeRoles("rider"), async (req, res) => {
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);
  const accuracy = req.body.accuracy == null ? null : Number(req.body.accuracy);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ success: false, message: "Valid latitude and longitude are required." });
  }
  try {
    await db.execute("INSERT INTO rider_locations (rider_id, latitude, longitude, accuracy) VALUES (?, ?, ?, ?)", [req.user.id, latitude, longitude, Number.isFinite(accuracy) ? accuracy : null]);
    await db.execute("UPDATE rider_profiles SET last_seen_at = CURRENT_TIMESTAMP WHERE user_id = ?", [req.user.id]);
    res.status(201).json({ success: true, message: "Location received." });
  } catch (error) {
    console.error("Save rider location error:", error);
    res.status(500).json({ success: false, message: "Unable to save rider location." });
  }
});

// Rider app: append an auditable action (accepted, picked_up, delivered, etc.).
app.post("/api/rider/activity", authenticateToken, authorizeRoles("rider"), async (req, res) => {
  const eventType = String(req.body.event_type || "").trim().toLowerCase();
  const description = String(req.body.description || "").trim();
  const allowedEvents = ["online", "offline", "accepted", "reached_pickup", "picked_up", "reached_dropoff", "delivered", "cancelled", "status_changed"];
  if (!allowedEvents.includes(eventType) || !description) return res.status(400).json({ success: false, message: "A valid event_type and description are required." });
  try {
    const [result] = await db.execute("INSERT INTO rider_activities (rider_id, order_id, event_type, description) VALUES (?, ?, ?, ?)", [req.user.id, req.body.order_id || null, eventType, description]);
    res.status(201).json({ success: true, activityId: result.insertId });
  } catch (error) {
    console.error("Save rider activity error:", error);
    res.status(500).json({ success: false, message: "Unable to save rider activity." });
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
        await initializePricingDatabase();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();
