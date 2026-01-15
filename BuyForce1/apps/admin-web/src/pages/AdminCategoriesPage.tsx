import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type Category = { id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    if (!token) return;
    try {
      setErr(null);
      const data = await adminApi<{ items: Category[] }>("/admin/categories", token);
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed");
    }
  }

  useEffect(() => { load(); }, [token]);

  async function add() {
    if (!token) return;
    const n = name.trim();
    const s = slug.trim().toLowerCase();
    if (!n || !s) return alert("name+slug required");

    await adminApi("/admin/categories", token, {
      method: "POST",
      body: JSON.stringify({ name: n, slug: s }),
    });

    setName(""); setSlug("");
    await load();
  }

  async function del(id: string) {
    if (!token) return;
    if (!confirm("Delete category?")) return;
    await adminApi(`/admin/categories/${id}`, token, { method: "DELETE" });
    await load();
  }

  if (!token) return <div className="card">Login again.</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Categories</h2>

        <div className="row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Slug (electronics)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <button className="btn" onClick={add}>Add</button>
          <button className="btn secondary" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="card">
        <AdminTable
          columns={[
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "slug", title: "Slug" },
            {
              key: "_actions",
              title: "Actions",
              render: (c: Category) => (
                <button className="btn danger" onClick={() => del(c.id)}>Delete</button>
              ),
            },
          ]}
          rows={items}
        />
      </div>
    </div>
  );
}
