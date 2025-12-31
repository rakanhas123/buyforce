import { Router } from "express";
import { pool } from "../db/db";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

// GET /v1/admin/users
router.get("/", adminOnly, async (_req, res) => {
  const r = await pool.query(
    `SELECT id, "fullName", email, role FROM users ORDER BY "fullName" ASC NULLS LAST, email ASC`
  );
  return res.json({ items: r.rows });
});

export default router;
