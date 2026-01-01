import express from 'express';
import PaymentsService from './payments.service';
import PayPalService from './paypal.service';

const router = express.Router();
const paymentsService = new PaymentsService();
const paypal = new PayPalService();

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

export default router;
