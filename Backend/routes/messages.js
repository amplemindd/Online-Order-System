// OWNER: Backend student 3
// Lets the web page send a message and read all messages.
// Messages live in memory, so they disappear when the server restarts.

const express = require("express");
const router = express.Router();

const messages = [];

// GET /api/messages
router.get("/", (req, res) => {
  res.json({ messages });
});

// POST /api/messages   body: { "name": "...", "text": "..." }
router.post("/", (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: "Both name and text are required" });
  }

  const message = {
    id: messages.length + 1,
    name: String(name).trim(),
    text: String(text).trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  res.status(201).json({ message });
});

module.exports = router;
