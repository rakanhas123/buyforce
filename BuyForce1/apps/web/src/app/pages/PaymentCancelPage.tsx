import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Payment Cancelled</h2>
      <p>You cancelled the checkout.</p>
      <Link to="/groups">
        <button style={{ marginTop: 12 }}>Back to groups</button>
      </Link>
    </div>
  );
}
