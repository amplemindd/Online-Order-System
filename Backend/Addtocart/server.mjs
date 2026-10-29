import dotenv from "dotenv";
import db from "./db.js";
import initializeDatabase from "./init-db.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: ["http://localhost:3000", "https://amplemindd.github.io"]
    })
);

app.use(express.json());

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
            message: "GoDaddy MySQL connected successfully!",
            database: rows
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message,
            code: error.code
        });
    }
});

// Add product to cart
app.post("/api/cart", async (req, res) => {
    try {
        const {
            product_name,
            product_price,
            quantity
        } = req.body;

        const price = Number(product_price);
        const qty = Number(quantity);

        if (
            typeof product_name !== "string" ||
            !product_name.trim() ||
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

        const total_price = Number((price * qty).toFixed(2));

        const sql = `
            INSERT INTO cart_items
            (product_name, product_price, quantity, total_price)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            product_name.trim(),
            price,
            qty,
            total_price
        ]);

        res.status(201).json({
            success: true,
            message: "Product added to cart successfully!",
            id: result.insertId,
            product_name: product_name.trim(),
            product_price: price,
            quantity: qty,
            total_price
        });
    } catch (error) {
        console.error("Add to cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add product to cart."
        });
    }
});

// Get all cart items
app.get("/api/cart", async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT * FROM cart_items ORDER BY id DESC"
        );

        res.json({
            success: true,
            items: results
        });
    } catch (error) {
        console.error("Fetch cart error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart items."
        });
    }
});

// Temporary frontend-backend connection test
app.post("/api/products", (req, res) => {
    res.json({
        success: true,
        message: "Frontend connected to backend successfully!",
        received: req.body
    });
});

// Start server after database initialization
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            "Server startup failed. Check database connection and table permissions."
        );

        process.exit(1);
    }
}

startServer();
