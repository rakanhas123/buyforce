import { useEffect, useState } from "react";
import http from "../api/http";

type WishRow = {
  id: string;
  name: string;
  url?: string;
  created_at: string;
  user_id: string;
  email: string;
  fullName: string;
};

export default function AdminWishlistPage() {
  const [items, setItems] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await http.get("/v1/admin/wishlist");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load wishlists");
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
        <h2 style={{ marginTop: 0 }}>Wishlists</h2>
        <div className="muted">All wishlist items for all users.</div>

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
              <th>Item</th>
              <th>URL</th>
              <th>User</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>
                  {w.url ? (
                    <a href={w.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                      link
                    </a>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 800 }}>{w.fullName}</div>
                  <div className="muted">{w.email}</div>
                </td>
                <td className="muted">{new Date(w.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
