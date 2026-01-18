import { useEffect, useMemo, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { adminApi } from "../lib/adminApiClient";

type Category = { id: string; name: string; slug?: string | null };

type Product = {
  id: string;
  name: string;
  description?: string | null;
  priceRegular: any;
  priceGroup: any;
  imageUrl?: string | null;
  isActive?: boolean;
  categoryId?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  createdAt?: string | null;
};

function normalizeImageUrl(url: string) {
  const u = url.trim();
  if (!u) return "";
  if (u.includes("images.unsplash.com/")) {
    const base = u.split("?")[0];
    return `${base}?auto=format&fit=crop&w=600&h=600&q=80`;
  }
  return u;
}

export default function AdminProductsPage() {
  const hasKey = !!localStorage.getItem("ADMIN_KEY");

  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceRegular, setPriceRegular] = useState("");
  const [priceGroup, setPriceGroup] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minParticipants, setMinParticipants] = useState("10");
  const [isActive, setIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await adminApi<{ items: Product[] }>("/admin/products");
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await adminApi<{ items: Category[] }>("/admin/categories");
      setCategories(data.items ?? []);
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    if (!hasKey) return;
    load();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey]);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      name: p.name ?? "",
      description: p.description ?? "",
      priceRegular: String(p.priceRegular ?? ""),
      priceGroup: String(p.priceGroup ?? ""),
      imageUrl: p.imageUrl ?? "",
      categoryId: p.categoryId ?? "",
      isActive: Boolean(p.isActive),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  async function saveEdit(id: string) {
    const n = String(draft.name ?? "").trim();
    if (!n) return alert("Name is required");

    const pr = String(draft.priceRegular ?? "").trim();
    const pg = String(draft.priceGroup ?? "").trim();
    if (!pr || !pg) return alert("Prices are required");

    setSavingId(id);
    try {
      await adminApi(`/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: n,
          description: (draft.description ?? "") === "" ? null : String(draft.description),
          priceRegular: pr,
          priceGroup: pg,
          imageUrl: normalizeImageUrl(String(draft.imageUrl ?? "")) || null,
          isActive: Boolean(draft.isActive),
          categoryId: String(draft.categoryId ?? "").trim() || null,
        }),
      });

      setEditingId(null);
      setDraft({});
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function onCreate() {
    const n = name.trim();
    if (!n) return alert("Name is required");
    if (!priceRegular.trim() || !priceGroup.trim()) return alert("Prices are required");

    const min = Number(minParticipants || 10);
    if (!Number.isFinite(min) || min < 1) return alert("Min participants must be a number >= 1");

    setCreating(true);
    try {
      await adminApi("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name: n,
          description: description.trim() || null,
          priceRegular: priceRegular.trim(),
          priceGroup: priceGroup.trim(),
          imageUrl: normalizeImageUrl(imageUrl) || null,
          isActive,
          categoryId: categoryId.trim() || null,
          minParticipants: min,
        }),
      });

      setName("");
      setDescription("");
      setPriceRegular("");
      setPriceGroup("");
      setImageUrl("");
      setCategoryId("");
      setMinParticipants("10");
      setIsActive(true);

      await load();
    } catch (e: any) {
      alert(e?.message ?? "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function onToggle(id: string) {
    try {
      await adminApi(`/admin/products/${id}/toggle`, { method: "POST" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Toggle failed");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await adminApi(`/admin/products/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

  const rows = useMemo(() => items, [items]);

  if (!hasKey) return <div className="card">Missing admin token. Login again.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "#ef4444" }}>{err}</div>;

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#fff" }}>Products</h2>
            <div className="muted">Create, edit, and manage products</div>
          </div>

          <div className="row">
            <button className="btn secondary" onClick={loadCategories}>Refresh Categories</button>
            <button className="btn secondary" onClick={load}>Refresh</button>
          </div>
        </div>

        <div className="hr" />

        <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Add Product</h3>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" placeholder="Price Regular" value={priceRegular} onChange={(e) => setPriceRegular(e.target.value)} />
          <input className="input" placeholder="Price Group" value={priceGroup} onChange={(e) => setPriceGroup(e.target.value)} />
          <input className="input" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

          <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            className="input"
            placeholder="Min participants (e.g. 10)"
            value={minParticipants}
            onChange={(e) => setMinParticipants(e.target.value)}
          />

          <label className="pill" style={{ display: "flex", gap: 10, alignItems: "center", height: 42 }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>

          <button className="btn" onClick={onCreate} disabled={creating} style={{ height: 42 }}>
            {creating ? "Creating…" : "Add"}
          </button>
        </div>
      </div>

      <div className="card">
        <AdminTable
          columns={[
            { key: "id", title: "ID" },
            {
              key: "imageUrl",
              title: "Image",
              render: (p: Product) => {
                const url = normalizeImageUrl(String(p.imageUrl ?? ""));
                if (!url) return "-";
                return (
                  <img
                    src={url}
                    alt={p.name}
                    style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 10, border: "1px solid #1f1f2e" }}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                );
              },
            },
            {
              key: "name",
              title: "Name",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input className="input" value={String(draft.name ?? "")} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
                ) : (
                  p.name
                ),
            },
            {
              key: "priceRegular",
              title: "Regular",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input className="input" value={String(draft.priceRegular ?? "")} onChange={(e) => setDraft((d) => ({ ...d, priceRegular: e.target.value }))} />
                ) : (
                  `₪${p.priceRegular}`
                ),
            },
            {
              key: "priceGroup",
              title: "Group",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input className="input" value={String(draft.priceGroup ?? "")} onChange={(e) => setDraft((d) => ({ ...d, priceGroup: e.target.value }))} />
                ) : (
                  `₪${p.priceGroup}`
                ),
            },
            {
              key: "categoryId",
              title: "Category",
              render: (p: Product) =>
                editingId === p.id ? (
                  <select className="input" value={String(draft.categoryId ?? "")} onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}>
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  p.categoryName ?? p.categoryId ?? ""
                ),
            },
            {
              key: "isActive",
              title: "Active",
              render: (p: Product) =>
                editingId === p.id ? (
                  <label className="pill" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={Boolean(draft.isActive)} onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} />
                    Active
                  </label>
                ) : (
                  p.isActive ? "✅" : "❌"
                ),
            },
            {
              key: "_actions",
              title: "Actions",
              render: (p: Product) => {
                const isEditing = editingId === p.id;
                const isSaving = savingId === p.id;

                return (
                  <div className="row">
                    {!isEditing ? (
                      <>
                        <button className="btn secondary" type="button" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn secondary" type="button" onClick={() => onToggle(p.id)}>Toggle</button>
                        <button className="btn danger" type="button" onClick={() => onDelete(p.id)}>Delete</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" type="button" onClick={() => saveEdit(p.id)} disabled={isSaving}>
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button className="btn secondary" type="button" onClick={cancelEdit} disabled={isSaving}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                );
              },
            },
          ]}
          rows={rows}
        />
      </div>
    </div>
  );
}
