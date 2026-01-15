import { Request, Response } from "express";
import PaymentsService from "./payments.service";

const payments = new PaymentsService();
type AuthRequest = Request & { user: { id: string } };

function requireAuth(req: Request, res: Response): req is AuthRequest {
  if (!("user" in req) || !req.user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

export async function createPayPalOrder(req: Request, res: Response) {
  const auth = requireAuth(req, res);
  if (!auth) return;

  const { groupId, amount } = req.body ?? {};

  if (typeof groupId !== "string" || groupId.trim() === "") {
    return res.status(400).json({ message: "groupId is required" });
  }

  const amountNum = toNumber(amount);
  if (amountNum === null || amountNum <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" });
  }

  try {
    const order = await payments.createPayPalOrder(auth.userId, groupId, amountNum);
    return res.json({ orderId: order.id });
  } catch (err: any) {
    console.error("[createPayPalOrder]", err);
    return res.status(500).json({ message: "Failed to create PayPal order" });
  }
}

export async function capturePayPalOrder(req: Request, res: Response) {
  const auth = requireAuth(req, res);
  if (!auth) return;

  const { groupId, orderId, amount } = req.body ?? {};

  if (typeof groupId !== "string" || groupId.trim() === "") {
    return res.status(400).json({ message: "groupId is required" });
  }
  if (typeof orderId !== "string" || orderId.trim() === "") {
    return res.status(400).json({ message: "orderId is required" });
  }

  const amountNum = toNumber(amount);
  if (amountNum === null || amountNum <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" });
  }

  try {
    await payments.capturePayPalOrder(auth.userId, groupId, orderId, amountNum);
    return res.json({ success: true });
  } catch (err: any) {
    console.error("[capturePayPalOrder]", err);
    return res.status(500).json({ message: "Failed to capture PayPal order" });
  }
}
