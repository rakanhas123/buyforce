import { Router } from "express";
import * as jwt from "jsonwebtoken";
const router = Router();

router.post("/login", async (req, res) => {
  const email = String(req.body?.email || "").toLowerCase();
  const password = String(req.body?.password || "");

  if (email !== "admin@buyforce.com" || password !== (process.env.ADMIN_PASSWORD || "admin1234")) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
