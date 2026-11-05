const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const cleanName = (name || "").trim();

  if (!cleanName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (!/^[A-Za-z ]+$/.test(cleanName)) {
    return res.status(400).json({ message: "Name must contain only letters" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: "Enter a valid email" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)`,
      [cleanName, "", email.trim().toLowerCase(), hashedPassword],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Registration failed" });
        }

        return res.status(201).json({ message: "Registration successful!" });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;