const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());

// Health API
app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Backend is running successfully!"
    });

});

// Team API
app.get("/api/team", (req, res) => {

    res.json({
        success: true,
        message: "Team details fetched successfully!",

        members: [
            {
                name: "Hrutuja",
                role: "Home Page Developer"
            },
            {
                name: "Gaurav",
                role: "About Page Developer"
            }
        ]

    });

});

// Start server
app.listen(PORT, () => {

    console.log(`Backend running at http://localhost:${PORT}`);

});