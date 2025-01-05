require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const RED = require("node-red");

// Models (Import your MongoDB models here)
const ExecutionLog = require("./models/execution.model");

//routes import
const userRoute = require("./routes/user.route");
const elementRoute = require("./routes/element.route");
const apiConfigRoute = require("./routes/apiConfig.route")

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Node-RED settings
const settings = {
  httpAdminRoot: "/red",
  httpNodeRoot: "/api",
  userDir: "./nodered",
  functionGlobalContext: {},
  editorTheme: {
    projects: {
      enabled: false,
    },
  },
};

// Initialize Node-RED
RED.init(server, settings);
app.use(settings.httpAdminRoot, RED.httpAdmin);
app.use(settings.httpNodeRoot, RED.httpNode);

// Start Node-RED runtime
RED.start();

//utility routes
app.use("/users", userRoute);
app.use("/element", elementRoute);
app.use("/config", apiConfigRoute)

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Similar CRUD operations for Workflows, ApiConfig, and ExecutionLog

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});