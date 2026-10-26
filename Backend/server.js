// OWNER: Backend student 1
// This file starts the server and plugs in the route files.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const studentsRoute = require("./routes/students");
const messagesRoute = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS lets a page running on another address (e.g. localhost:5500)
// call this server. Without it the browser BLOCKS the request.
app.use(cors());

// Lets us read JSON sent in the body of POST requests.
app.use(express.json());

// Simple route to check the backend is alive.
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    time: new Date().toISOString(),
  });
});

app.use("/api/students", studentsRoute);
app.use("/api/messages", messagesRoute);

// Anything else: tell the caller clearly what went wrong.
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
