import * as paypal from "@paypal/checkout-server-sdk";

export default class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const environment =
      process.env.PAYPAL_MODE === "live"
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_CLIENT_SECRET!
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_CLIENT_SECRET!
          );

    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createOrder(amount: number) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "ILS",
            value: amount.toFixed(2),
          },
        },
      ],
    });

    const res = await this.client.execute(request);
    return res.result;
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const res = await this.client.execute(request);
    return res.result;
  }
}
