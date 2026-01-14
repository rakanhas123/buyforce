import { Router } from "express";
import { pool } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

type Role = "USER" | "ADMIN";

function signToken(payload: { id: string; email: string; role?: Role }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");

  // NOTE: subject -> decoded.sub (your middleware uses this)
  return jwt.sign(
    { email: payload.email, role: payload.role || "USER" }, // payload
    secret,
    { expiresIn: "7d", subject: payload.id }
  );
}

/**
 * POST /v1/auth/register
 * body: { fullName, email, password }
 * DB must have: users(id uuid, "fullName", email, password_hash, role)
 */
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body as {
    fullName?: string;
    email?: string;
    password?: string;
  };

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "fullName, email, password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await pool.query(`SELECT id FROM users WHERE email=$1`, [normalizedEmail]);
    if ((existing.rowCount ?? 0) > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into users table (id is auto-increment integer, no role column)
    const created = await pool.query(
      `
      INSERT INTO users (full_name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, full_name as "fullName", email
      `,
      [fullName, normalizedEmail, passwordHash]
    );

    const user = created.rows[0] as { id: number; fullName: string; email: string };
    const accessToken = signToken({ id: user.id.toString(), email: user.email, role: "USER" });

    return res.json({ user: { ...user, role: "USER" }, token: accessToken });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Register failed" });
  }
});

/**
 * POST /v1/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      `SELECT id, full_name as "fullName", email, password FROM users WHERE email=$1`,
      [normalizedEmail]
    );

    if ((result.rowCount ?? 0) === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const row = result.rows[0] as {
      id: number;
      fullName: string;
      email: string;
      password: string;
    };

    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const user = { id: row.id, fullName: row.fullName, email: row.email, role: "USER" };
    const accessToken = signToken({ id: row.id.toString(), email: row.email, role: "USER" });

    return res.json({ user, token: accessToken });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? "Login failed" });
  }
});

export default router;
