import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCheckout } from "../api/paymentsApi";

export default function PayNowButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onPay() {
    try {
      setLoading(true);
      const url = await createCheckout(groupId);

      // backend returns: http://localhost:5173/payment/checkout?groupId=...
      const u = new URL(url);
      nav(u.pathname + u.search); // go to SPA route without losing token
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={onPay} disabled={loading}>
      {loading ? "Opening..." : "Pay now"}
    </button>
  );
}
