// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows JSON in request bodies

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Load custom routes (create them later)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

module.exports = app;
