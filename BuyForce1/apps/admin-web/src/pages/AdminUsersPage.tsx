import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
<<<<<<< HEAD
import { useAdminAuth } from "../auth/AdminAuthContext";
=======
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
import { adminApi } from "../lib/adminApiClient";

type UserRow = {
  id: string;
  email: string;
  fullName?: string | null;
<<<<<<< HEAD
=======
  role?: string | null;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  createdAt?: string | null;
};

export default function AdminUsersPage() {
<<<<<<< HEAD
  const { token } = useAdminAuth();
=======
  const hasKey = !!localStorage.getItem("ADMIN_KEY");

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const [items, setItems] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
<<<<<<< HEAD
      const data = await adminApi<{ items: UserRow[] }>("/admin/users", token);
=======
      const data = await adminApi<{ items: UserRow[] }>("/admin/users");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasKey) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
<<<<<<< HEAD
  }, [token]);

  async function onDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this user?")) return;
    try {
      await adminApi(`/admin/users/${id}`, token, { method: "DELETE" });
=======
  }, [hasKey]);

  async function onDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    try {
      await adminApi(`/admin/users/${id}`, { method: "DELETE" });
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

<<<<<<< HEAD
  if (!token) return <div className="card">Missing admin token. Login again.</div>;
=======
  if (!hasKey) return <div className="card">Missing admin token. Login again.</div>;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
<<<<<<< HEAD
=======
          { key: "role", title: "Role" },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
