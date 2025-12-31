import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(fullName, email, password);
      nav("/groups");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 12 }}>
      <h2>Register</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
