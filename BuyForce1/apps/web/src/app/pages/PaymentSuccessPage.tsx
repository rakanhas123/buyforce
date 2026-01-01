import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { markPaid } from "../../api/paymentsApi";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const groupId = params.get("groupId");
  const [msg, setMsg] = useState("Finishing payment...");

  useEffect(() => {
    (async () => {
      try {
        if (!groupId) {
          setMsg("Missing groupId");
          return;
        }
        await markPaid(groupId);
        setMsg("Payment completed ✅ (group marked CHARGED)");
      } catch (e: any) {
        setMsg(e?.response?.data?.error || e?.message || "Failed to mark paid");
      }
    })();
  }, [groupId]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 12 }}>
      <h2>Payment Success</h2>
      <p>{msg}</p>
      <Link to="/groups">Back to groups</Link>
    </div>
  );
}
