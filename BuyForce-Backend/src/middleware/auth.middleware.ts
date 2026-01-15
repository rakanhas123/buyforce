import type { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
export type AuthUser = { id: string; email?: string };
export type AuthRequest = Request & { user?: AuthUser };

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: "Missing JWT_SECRET in env" });

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    // support both styles:
    // - new: sub = userId
    // - old: id = userId
    const userId =
      (typeof decoded.sub === "string" && decoded.sub) ||
      (typeof (decoded as any).id === "string" && (decoded as any).id);

    if (!userId) return res.status(401).json({ error: "Invalid token payload" });

    (req as AuthRequest).user = {
      id: userId,
      email: typeof decoded.email === "string" ? decoded.email : undefined,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
