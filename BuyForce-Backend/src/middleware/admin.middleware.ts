import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export type AdminRequest = {
  admin?: { email: string };
};

export function adminOnly(req: any, res: Response, next: NextFunction) {
  try {
    const auth = String(req.headers.authorization ?? "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ error: "Missing Authorization header" });

    const payload = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "dev_secret"
    ) as any;

    const email = String(payload?.email ?? "").toLowerCase();
    const role = String(payload?.role ?? "");

    if (role !== "admin" || email !== "admin@buyforce.com") {
      return res.status(403).json({ error: "Admin only" });
    }

    (req as AdminRequest).admin = { email };
    next();
  } catch (e: any) {
    return res.status(401).json({ error: e?.message ?? "Unauthorized" });
  }
}
