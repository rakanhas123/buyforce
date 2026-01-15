import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@buyforce.com");
  const [password, setPassword] = useState("admin1234");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(`${BASE}/v1/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");

      login(data.token);
      nav("/admin/users");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2 style={{ marginTop: 0 }}>Admin Login</h2>

      <form onSubmit={onSubmit} className="grid">
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />

        {err && <div style={{ color: "crimson" }}>{err}</div>}

        <button className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
