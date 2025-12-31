import Stripe from "stripe";
import { pool } from "../db/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function webhookHandler(req: any, res: any) {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const groupId = session.metadata?.groupId;

    if (groupId) {
      await pool.query(`UPDATE groups SET status='CHARGED' WHERE id=$1`, [groupId]);
      // Optional: store session.id, payment_intent, etc in a payments table
    }
  }

  res.json({ received: true });
}
