
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("./db");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("Registration API is running!");
});

// Registration API
app.post("/api/register", async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL query
        const sql = `
            INSERT INTO users (name, email, phone, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, phone || null, hashedPassword],
            (err, result) => {

                if (err) {

                    console.log("Database error:", err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Email already registered"
                        });
                    }

                    return res.status(500).json({
                        message: "Database insertion failed"
                    });
                }

                return res.status(201).json({
                    message: "Registration successful!",
                    userId: result.insertId
                });

            }
        );

    } catch (error) {

        console.log("Server error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
