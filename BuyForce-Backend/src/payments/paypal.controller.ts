import { Request, Response } from "express";
import PaymentsService from "./payments.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const payments = new PaymentsService();

export async function createPayPalOrder(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { groupId, amount } = req.body;

  const order = await payments.createPayPalOrder(
    +req.user.id,
    groupId,
    amount
  );

  res.json({ orderId: order.id });
}

export async function capturePayPalOrder(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { groupId, orderId, amount } = req.body;

  await payments.capturePayPalOrder(
    +req.user.id,
    groupId,
    orderId,
    amount
  );

  res.json({ success: true });
}
