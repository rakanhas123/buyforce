import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type Category = { id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
<<<<<<< HEAD
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
=======
  const { adminKey } = useAdminAuth();

  const [items, setItems] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    if (!adminKey) return;
    setLoading(true);
    try {
      setErr(null);
      const data = await adminApi<{ items: Category[] }>("/admin/categories");
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  async function add() {
    const n = name.trim();
    const s = slug.trim().toLowerCase();
    if (!n || !s) return alert("name + slug required");

    setCreating(true);
    try {
      await adminApi("/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: n, slug: s }),
      });

      setName("");
      setSlug("");
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete category?")) return;

    try {
      await adminApi(`/admin/categories/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

  if (!adminKey) return <div className="card">Not logged in. Go to Admin Login.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "#ef4444" }}>{err}</div>;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

  return (
    <div className="grid">
      <div className="card">
<<<<<<< HEAD
        <h2 style={{ marginTop: 0 }}>Categories</h2>

        <div className="row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Slug (electronics)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <button className="btn" onClick={add}>Add</button>
          <button className="btn secondary" onClick={load}>Refresh</button>
=======
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#fff" }}>Categories</h2>
            <div className="muted">Create and manage product categories</div>
          </div>

          <div className="row">
            <button className="btn secondary" onClick={load}>Refresh</button>
          </div>
        </div>

        <div className="hr" />

        <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Add Category</h3>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", alignItems: "center" }}>
          <input className="input" placeholder="Name (Electronics)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Slug (electronics)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <button className="btn" onClick={add} disabled={creating} style={{ height: 42 }}>
            {creating ? "Creating…" : "Add"}
          </button>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
<<<<<<< HEAD
                <button className="btn danger" onClick={() => del(c.id)}>Delete</button>
=======
                <button className="btn danger" type="button" onClick={() => del(c.id)}>
                  Delete
                </button>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
              ),
            },
          ]}
          rows={items}
        />
      </div>
    </div>
  );
}
