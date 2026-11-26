
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LIYU GEBEYA API"
  });
});

// Server health
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Backend is running"
  });
});

// Database health
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time"
    );

    res.json({
      success: true,
      status: "PostgreSQL connected",
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      status: "Database connection failed"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LIYU GEBEYA API running on port ${PORT}`);
});
