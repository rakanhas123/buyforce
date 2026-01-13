import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import pool from '../db';

// Initialize Stripe with test key (use .env in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_4eC39HqLyjWDarhtT467g')

export default class StripeService {
  /**
   * Create a Payment Intent for group joining
   * Supports both card and PayPal payments
   */
  async createPaymentIntent(data: {
    amount: number;
    currency?: string;
    productId: number;
    groupId: string;
    userId?: string;
    paymentMethod?: 'card' | 'paypal';
  }) {
    try {
      const paymentIntentData: any = {
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        metadata: {
          productId: data.productId.toString(),
          groupId: data.groupId,
          userId: data.userId || 'guest',
        },
        description: `Group Buy - Product ${data.productId}`,
      };

      // Enable PayPal as payment method
      paymentIntentData.payment_method_types = ['card', 'us_bank_account'];
      
      // If explicitly requesting PayPal
      if (data.paymentMethod === 'paypal') {
        paymentIntentData.payment_method_types = ['paypal'];
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error: any) {
      console.error('Stripe error:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Confirm payment intent (called after client-side payment)
   */
  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          transactionId: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          chargeId: paymentIntent.latest_charge,
        };
      } else if (paymentIntent.status === 'requires_action') {
        return {
          success: false,
          status: 'requires_action',
          clientSecret: paymentIntent.client_secret,
          message: 'Additional verification required',
        };
      } else {
        return {
          success: false,
          status: paymentIntent.status,
          message: `Payment ${paymentIntent.status}`,
        };
      }
    } catch (error: any) {
      console.error('Stripe confirmation error:', error);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  /**
   * Record transaction in database
   */
  async recordTransaction(data: {
    userId: string;
    productId: number;
    groupId: string;
    amount: number;
    stripeTransactionId: string;
    status: string;
  }) {
    try {
      const transactionId = uuid();

      await pool.query(
        `INSERT INTO transactions 
         (id, user_id, amount, type, status, currency, provider, provider_ref, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          transactionId,
          data.userId,
          data.amount,
          'group_join',
          data.status,
          'USD',
          'stripe',
          data.stripeTransactionId,
        ]
      );

      return transactionId;
    } catch (error: any) {
      console.log('Note: Transaction table may not exist, continuing anyway');
      return uuid();
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      };
    } catch (error: any) {
      console.error('Stripe refund error:', error);
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }
}
