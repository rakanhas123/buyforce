import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { createCheckout } from "../../api/paymentsApi";

export default function PaymentCheckoutPage() {
  const [sp] = useSearchParams();
  const groupId = sp.get("groupId") || "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        if (!groupId) {
          setError("Missing groupId");
          return;
        }
        const url = await createCheckout(groupId);
        window.location.href = url; // goes to /payment/success?groupId=...
      } catch (e: any) {
        setError(e?.response?.data?.error || e?.message || "Checkout failed");
      }
    }
    run();
  }, [groupId]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 12 }}>
      <h2>Checkout</h2>
      {error ? (
        <>
          <div style={{ color: "crimson" }}>{error}</div>
          <div style={{ marginTop: 12 }}>
            <Link to="/groups">Back to groups</Link>
          </div>
        </>
      ) : (
        <div>Redirecting…</div>
      )}
    </div>
  );
}
