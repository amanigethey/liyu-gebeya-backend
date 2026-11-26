
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err.message);
});

// Create marketplace tables
async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      google_id TEXT UNIQUE,
      phone TEXT UNIQUE,
      display_name TEXT NOT NULL,
      profile_image_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS listings (
      id BIGSERIAL PRIMARY KEY,
      seller_id BIGINT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      listing_type TEXT,
      price NUMERIC(14,2),
      currency TEXT DEFAULT 'ETB',
      location TEXT,
      attributes JSONB DEFAULT '{}'::jsonb,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS listing_images (
      id BIGSERIAL PRIMARY KEY,
      listing_id BIGINT NOT NULL
        REFERENCES listings(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INTEGER NOT NULL
        CHECK (sort_order BETWEEN 1 AND 5),
      UNIQUE (listing_id, sort_order)
    );

    CREATE INDEX IF NOT EXISTS idx_listings_category
      ON listings(category);

    CREATE INDEX IF NOT EXISTS idx_listings_created
      ON listings(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_listings_seller
      ON listings(seller_id);
  `);

  console.log("LIYU GEBEYA database tables are ready");
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to LIYU GEBEYA API"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Backend is running"
  });
});

app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");
    res.json({
      success: true,
      status: "PostgreSQL connected",
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      status: "Database connection failed"
    });
  }
});

app.get("/db-tables", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    res.json({
      success: true,
      tables: result.rows.map(row => row.table_name)
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`LIYU GEBEYA API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  });
