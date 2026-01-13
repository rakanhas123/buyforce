import express from 'express';
import PaymentsService from './payments.service';
import PayPalService from './paypal.service';
import StripeService from './stripe.service';
import { v4 as uuid } from 'uuid';
import pool from '../db';

const router = express.Router();
const paymentsService = new PaymentsService();
const paypal = new PayPalService();
const stripe = new StripeService();

// PRE-AUTH
router.post('/preauth', async (req, res) => {
  try {
    const { userId, groupId, tokenRef } = req.body;
    const result = await paymentsService.preAuth(userId, groupId, tokenRef);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// CHARGE
router.post('/charge', async (req, res) => {
  try {
    const { userId, groupId, tokenRef, amount } = req.body;
    const result = await paymentsService.charge(userId, groupId, tokenRef, amount);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// REFUND
router.post('/refund', async (req, res) => {
  try {
    const { userId, groupId, providerRef, amount } = req.body;
    const result = await paymentsService.refund(userId, groupId, providerRef, amount);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ============================
// PAYPAL — CREATE ORDER
// ============================
router.post('/paypal/create', async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await paypal.createOrder(amount);
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================
// PAYPAL — CAPTURE ORDER
// ============================
router.post('/paypal/capture', async (req, res) => {
  try {
    const { orderId } = req.body;
    const result = await paypal.captureOrder(orderId);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================
// GROUP JOIN WITH PAYMENT
// ============================
router.post('/group-join', async (req, res) => {
  try {
    const { productId, groupId, amount, paymentMethod } = req.body;
    const userId = req.user?.id || 'guest-' + uuid(); // Use authenticated user or generate guest ID
    const transactionId = uuid();

    // For demo purposes, we'll accept payment with both methods
    // In production, you would integrate with Stripe or PayPal SDKs

    if (paymentMethod === 'stripe') {
      // TODO: Integrate with Stripe API
      // For now, we'll simulate successful payment
    } else if (paymentMethod === 'paypal') {
      // TODO: Integrate with PayPal API
      // For now, we'll simulate successful payment
    }

    // Simulate successful payment processing
    // In production, wait for actual payment confirmation

    // Record the transaction
    try {
      await pool.query(
        `INSERT INTO transactions 
         (id, user_id, amount, type, status, currency, provider, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          transactionId,
          userId,
          amount,
          'group_join',
          'COMPLETED',
          'USD',
          paymentMethod,
        ]
      );
    } catch (dbErr) {
      console.log('Note: Transaction table may not exist, skipping record');
    }

    // Return success response
    res.json({
      success: true,
      transactionId,
      amount,
      productId,
      groupId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Payment error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Payment processing failed',
      message: 'Please try again or contact support'
    });
  }
});

// ============================
// CONFIRM PAYMENT
// ============================
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, productId, groupId, userId } = req.body;

    // Confirm the payment with Stripe
    const confirmResult = await stripe.confirmPaymentIntent(paymentIntentId);

    if (confirmResult.success) {
      // Record transaction
      const transactionId = await stripe.recordTransaction({
        userId: userId || 'guest',
        productId,
        groupId,
        amount: confirmResult.amount,
        stripeTransactionId: confirmResult.transactionId,
        status: 'COMPLETED',
      });

      res.json({
        success: true,
        transactionId,
        status: 'completed',
        amount: confirmResult.amount,
        chargeId: confirmResult.chargeId,
      });
    } else {
      res.status(400).json({
        success: false,
        status: confirmResult.status,
        message: confirmResult.message,
        clientSecret: confirmResult.clientSecret,
      });
    }
  } catch (err: any) {
    console.error('Confirm payment error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
