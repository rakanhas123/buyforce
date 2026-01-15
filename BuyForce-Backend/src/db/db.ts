import "dotenv/config";
import { Pool } from "pg";

const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
for (const k of required) {
  if (!process.env[k]) {
    console.error(` Missing env var: ${k}`);
    throw new Error(`Missing env var: ${k}`);
  }
}

console.log("Creating DB pool with:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER
});

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

console.log("DB pool created successfully");

export async function dbHealthCheck(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("DB health check failed:", err);
    return false;
  }
}
