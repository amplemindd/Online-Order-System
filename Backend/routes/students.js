// OWNER: Backend student 2
// Returns the team list. Later this will read from MySQL instead.

const express = require("express");
const router = express.Router();

// Fake data for now (this replaces the database during practice).
const students = [
  { id: 1, name: "Aarav", role: "Web (React)" },
  { id: 2, name: "Diya", role: "Android (React Native)" },
  { id: 3, name: "Kabir", role: "iOS (Swift)" },
  { id: 4, name: "Meera", role: "Backend (Node.js)" },
  { id: 5, name: "Rohan", role: "Database (MySQL)" },
];

// GET /api/students
router.get("/", (req, res) => {
  res.json({ students });
});

module.exports = router;
