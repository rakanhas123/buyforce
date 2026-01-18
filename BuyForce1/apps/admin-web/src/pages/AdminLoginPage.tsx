import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@buyforce.com");
  const [password, setPassword] = useState("admin1234");
=======
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@buyforce.com");
  const [password, setPassword] = useState("");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const nav = useNavigate();
<<<<<<< HEAD
=======
  const loc = useLocation() as any;
  const redirectTo = loc?.state?.from || "/admin/dashboard";
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

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

<<<<<<< HEAD
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");

      login(data.token);
      nav("/admin/users");
=======
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || `HTTP ${res.status}` };
      }

      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      if (!data.adminKey) throw new Error("Missing adminKey in response");

      login(data.adminKey);

      // ✅ go to the protected page (or dashboard)
      nav(redirectTo, { replace: true });
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
<<<<<<< HEAD
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
=======
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

        {err && <div style={{ color: "crimson" }}>{err}</div>}

        <button className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
