const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

let pool;

// Use connection string directly
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("DB Connected to Supabase");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

module.exports = pool;