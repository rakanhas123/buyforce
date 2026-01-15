import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type UserRow = {
  id: string;
  email: string;
  fullName?: string | null;
  createdAt?: string | null;
};

export default function AdminUsersPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await adminApi<{ items: UserRow[] }>("/admin/users", token);
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this user?")) return;
    try {
      await adminApi(`/admin/users/${id}`, token, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

  if (!token) return <div className="card">Missing admin token. Login again.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      <div className="hr" />

      <AdminTable
        columns={[
          { key: "id", title: "ID" },
          { key: "email", title: "Email" },
          { key: "fullName", title: "Full Name" },
          {
            key: "_actions",
            title: "Actions",
            render: (u: UserRow) => (
              <button className="btn danger" type="button" onClick={() => onDelete(u.id)}>
                Delete
              </button>
            ),
          },
        ]}
        rows={items}
      />
    </div>
  );
}
