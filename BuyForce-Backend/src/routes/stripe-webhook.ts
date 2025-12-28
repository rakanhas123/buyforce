import { Router } from "express";
import stripe from "../services/stripe.service";
import pool from "../services/db.service";
import bodyParser from "body-parser";

const router = Router();

// ⚠️ Stripe חייב raw body
router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook signature failed", err.message);
      return res.status(400).send("Invalid signature");
    }

    try {
      switch (event.type) {
        case "payment_intent.amount_capturable_updated":
          console.log("Authorization succeeded");
          break;

        case "payment_intent.succeeded": {
          const intent: any = event.data.object;

          await pool.query(
            `UPDATE group_members
             SET product_paid = true
             WHERE payment_intent_id = $1`,
            [intent.id]
          );
          break;
        }

        case "payment_intent.canceled": {
          const intent: any = event.data.object;

          await pool.query(
            `DELETE FROM group_members
             WHERE payment_intent_id = $1`,
            [intent.id]
          );
          break;
        }

        default:
          console.log("Unhandled event:", event.type);
      }

      res.json({ received: true });
    } catch (err) {
      console.error(err);
      res.status(500).send("Webhook handler failed");
    }
  }
);

export default router;
