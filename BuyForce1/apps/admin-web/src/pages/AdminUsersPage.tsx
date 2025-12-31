import { useEffect, useState } from "react";
import http from "../api/http";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await http.get("/v1/admin/users");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Users</h2>
        <div className="muted">Read-only list of all users.</div>

        <div className="hr" />
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{u.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
