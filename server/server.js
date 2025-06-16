// server.js
require("dotenv").config();
const http = require("http");
const app = require("./app"); // This should be the Express app
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("message", (msg) => {
    io.emit("message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});
