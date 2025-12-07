import { v4 as uuid } from 'uuid';
import pool from '../db/db';
import TranzilaService from './tranzila.service';

export default class PaymentsService {
  private tranzila = new TranzilaService();

  // ==========================
  // יצירת טרנזקציה עם בדיקת כפילות
  // ==========================
  async createTransaction(data: any) {
    // בדיקת כפילות אמיתית
    const exists = await pool.query(
      `SELECT id FROM transactions WHERE idempotency_key=$1`,
      [data.idempotencyKey]
    );

    if (exists.rowCount! > 0) {
      console.log('[IDEMPOTENCY] Transaction already exists:', data.idempotencyKey);
      return; // לא ליצור שוב
    }

    await pool.query(
      `INSERT INTO transactions
       (id, user_id, group_id, amount, type, status, idempotency_key, currency, provider)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'ILS','Tranzila')`,
      [
        uuid(),
        data.userId,
        data.groupId ?? 0,
        data.amount,
        data.type,
        'INITIATED',
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
       SET 
         status = $1,
         provider_ref = $2,
         error_message = $3,
         error_code = $4,
         updated_at = NOW()
       WHERE idempotency_key = $5`,
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
  // PRE-AUTH
  // ==========================
  async preAuth(userId: number, groupId: number, tokenRef: string) {
    const key = `PREAUTH:${userId}:${groupId}`;

    await this.createTransaction({
      userId,
      groupId,
      amount: 1,
      type: 'PREAUTH',
      idempotencyKey: key,
    });

    try {
      const trx = await this.tranzila.preAuth(tokenRef);

      await this.updateTransaction(key, {
        status: 'SUCCESS',
        providerRef: trx.providerRef,
        errorCode: null,
      });

      return trx;
    } catch (err: any) {
      await this.updateTransaction(key, {
        status: 'FAILED',
        errorMessage: err.message,
        errorCode: err.code || null,
      });
      throw err;
    }
  }

  // ==========================
  // חיוב רגיל
  // ==========================
  async charge(userId: number, groupId: number, tokenRef: string, amount: number) {
    const key = `CHARGE:${userId}:${groupId}`;

    await this.createTransaction({
      userId,
      groupId,
      amount,
      type: 'CHARGE',
      idempotencyKey: key,
    });

    try {
      const trx = await this.tranzila.charge(tokenRef, amount);

      await this.updateTransaction(key, {
        status: 'SUCCESS',
        providerRef: trx.providerRef,
        errorCode: null,
      });

      return trx;
    } catch (err: any) {
      await this.updateTransaction(key, {
        status: 'FAILED',
        errorMessage: err.message,
        errorCode: err.code || null,
      });
      throw err;
    }
  }

  // ==========================
  // זיכוי
  // ==========================
  async refund(userId: number, groupId: number, providerRef: string, amount: number) {
    const key = `REFUND:${userId}:${groupId}`;

    await this.createTransaction({
      userId,
      groupId,
      amount,
      type: 'REFUND',
      idempotencyKey: key,
    });

    try {
      const trx = await this.tranzila.refund(providerRef, amount);

      await this.updateTransaction(key, {
        status: 'SUCCESS',
        errorCode: null,
      });

      return trx;
    } catch (err: any) {
      await this.updateTransaction(key, {
        status: 'FAILED',
        errorMessage: err.message,
        errorCode: err.code || null,
      });
      throw err;
    }
  }
}
