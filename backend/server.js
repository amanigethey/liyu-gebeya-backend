
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LIYU GEBEYA API"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Backend is running"
  });
});

// Database connection will be configured securely later.

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LIYU GEBEYA API running on port ${PORT}`);
});
