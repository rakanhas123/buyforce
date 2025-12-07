import express from 'express';
import PaymentsService from './payments.service';

const router = express.Router();
const paymentsService = new PaymentsService();

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

export default router;
