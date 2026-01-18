import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type GroupRow = {
  id: string;
  name?: string | null;
  status?: string;
  joinedCount?: number;
  minParticipants?: number;
  progress?: number;
  productId?: string | null;
  endsAt?: string | null;
};

export default function AdminGroupsPage() {
  const { adminKey } = useAdminAuth();

  const [items, setItems] = useState<GroupRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!adminKey) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await adminApi<{ items: GroupRow[] }>("/admin/groups");
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  async function action(path: string) {
    await adminApi(path, { method: "POST" });
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this group?")) return;
    await adminApi(`/admin/groups/${id}`, { method: "DELETE" });
    await load();
  }

  async function setMinParticipants(g: GroupRow) {
    const current = Number(g.minParticipants ?? 10);
    const val = prompt("Set min participants:", String(current));
    if (val == null) return;

    const n = Number(val);
    if (!Number.isFinite(n) || n < 1) return alert("Must be a number >= 1");

    try {
      await adminApi(`/admin/groups/${g.id}`, {
        method: "PUT",
        body: JSON.stringify({ minParticipants: n }),
      });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Failed to update minParticipants");
    }
  }

  if (!adminKey) return <div className="card">Not logged in. Go to Admin Login.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Groups</h2>
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      <div className="hr" />

      <AdminTable
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Name" },
          { key: "productId", title: "ProductId" },
          { key: "status", title: "Status" },
          { key: "joinedCount", title: "Joined" },
          { key: "minParticipants", title: "Min" },
          { key: "progress", title: "Progress" },
          {
            key: "_actions",
            title: "Actions",
            render: (g: GroupRow) => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn secondary" type="button" onClick={() => setMinParticipants(g)}>
                  Set Min
                </button>
                <button className="btn secondary" type="button" onClick={() => action(`/admin/groups/${g.id}/lock`)}>
                  Lock
                </button>
                <button className="btn secondary" type="button" onClick={() => action(`/admin/groups/${g.id}/unlock`)}>
                  Unlock
                </button>
                <button className="btn danger" type="button" onClick={() => onDelete(g.id)}>
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        rows={items}
      />
    </div>
  );
}
