import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = { id: string };

export type AuthRequest = Request & { user?: AuthUser };

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = header.substring("Bearer ".length).trim();
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ error: "Server misconfigured: missing JWT_SECRET" });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    const userId = decoded?.sub;
    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: userId };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
