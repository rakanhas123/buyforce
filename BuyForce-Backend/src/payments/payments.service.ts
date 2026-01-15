import { v4 as uuid } from "uuid";
import pool from "../db";
import PayPalService from "./paypal.service";

export default class PaymentsService {
  private paypal = new PayPalService();

  
  // ==========================
  // יצירת טרנזקציה (idempotent)
  // ==========================
  async createTransaction(data: any) {
    const exists = await pool.query(
      `SELECT id FROM transactions WHERE idempotency_key=$1`,
      [data.idempotencyKey]
    );

    if (exists.rowCount! > 0) {
      console.log("[IDEMPOTENCY] Transaction exists:", data.idempotencyKey);
      return;
    }

    await pool.query(
      `INSERT INTO transactions
       (id, user_id, group_id, amount, type, status, idempotency_key, currency, provider)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'ILS','PayPal')`,
      [
        uuid(),
        data.userId,
        data.groupId,
        data.amount,
        data.type,
        "INITIATED",
        data.idempotencyKey,
      ]
    );
  }

  // ==========================
  // עדכון טרנזקציה
  // ==========================
  async updateTransaction(idempotencyKey: string, fields: any) {
    await pool.query(
      `UPDATE transactions
       SET status=$1,
           provider_ref=$2,
           error_message=$3,
           error_code=$4,
           updated_at=NOW()
       WHERE idempotency_key=$5`,
      [
        fields.status,
        fields.providerRef || null,
        fields.errorMessage || null,
        fields.errorCode || null,
        idempotencyKey,
      ]
    );
  }

  // ==========================
  // PAYPAL – יצירת ORDER
  // ==========================
  async createPayPalOrder(
    userId: string,
    groupId: string,
    amount: number
  ) {
    const key = `PAYPAL:CREATE:${userId}:${groupId}`;

    await this.createTransaction({
      userId,
      groupId,
      amount,
      type: "CHARGE",
      idempotencyKey: key,
    });

    return this.paypal.createOrder(amount);
  }

  // ==========================
  // PAYPAL – אישור תשלום
  // ==========================
  async capturePayPalOrder(
    userId: string,
    groupId: string,
    orderId: string,
    amount: number
  ) {
    const key = `PAYPAL:CAPTURE:${userId}:${groupId}:${orderId}`;

    try {
      const result = await this.paypal.captureOrder(orderId);

      if (result.status !== "COMPLETED") {
        throw new Error("Payment not completed");
      }

      await this.updateTransaction(key, {
        status: "SUCCESS",
        providerRef: result.id,
      });

      return result;
    } catch (err: any) {
      await this.updateTransaction(key, {
        status: "FAILED",
        errorMessage: err.message,
      });
      throw err;
    }
    
  }
}
