
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query("BEGIN");
    await pool.query(schema);
    await pool.query("COMMIT");

    console.log("LIYU GEBEYA database tables created successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initializeDatabase();
