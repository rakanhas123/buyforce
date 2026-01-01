import axios from "axios";

export default class PayPalService {
  private clientId = process.env.PAYPAL_CLIENT_ID!;
  private secret = process.env.PAYPAL_SECRET!;
  private base = "https://api-m.sandbox.paypal.com";

  private async getAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString("base64");

    const res = await axios.post(
      `${this.base}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.data.access_token;
  }

  async createOrder(amount: number) {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `${this.base}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: String(amount) } }],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data; // מחזיר orderID
  }

  async captureOrder(orderId: string) {
    const token = await this.getAccessToken();

    const res = await axios.post(
      `${this.base}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  }
}
