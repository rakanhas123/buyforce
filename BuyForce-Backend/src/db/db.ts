import "dotenv/config";
import { Pool } from "pg";

const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing env var: ${k}`);
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function dbHealthCheck() {
  const r = await pool.query("SELECT 1 as ok");
  return r.rows?.[0]?.ok === 1;
}
