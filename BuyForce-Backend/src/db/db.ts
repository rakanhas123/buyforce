import "dotenv/config";
import { Pool } from "pg";

const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const pool = new Pool({
  host:"localhost",
  port: 5433,
  database: "buyforce",
  user: "postgres",
  password: "rakan1",
});

export async function dbHealthCheck(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("DB health check failed:", err);
    return false;
  }
}
