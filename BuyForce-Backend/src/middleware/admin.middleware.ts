import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: "Missing JWT_SECRET in env" });

  try {
    const decoded = jwt.verify(token, secret) as any;
    // you used subject -> decoded.sub, but role is in payload:
    const role = decoded.role;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Admin only" });
    }

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
