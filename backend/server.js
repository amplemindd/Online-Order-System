const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// POST API
app.post("/api/users", (req, res) => {
  const userData = req.body;

  console.log("Received user data:", userData);

  res.status(201).json({
    message: "User created successfully",
    user: userData,
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});