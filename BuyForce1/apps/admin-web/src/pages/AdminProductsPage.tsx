import { useEffect, useMemo, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  priceRegular: any;
  priceGroup: any;
  isActive?: boolean;
  categoryId?: string | null;
  createdAt?: string;
};

export default function AdminProductsPage() {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Add form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceRegular, setPriceRegular] = useState("");
  const [priceGroup, setPriceGroup] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await adminApi<{ items: Product[] }>("/admin/products", token);
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      name: p.name ?? "",
      description: p.description ?? "",
      priceRegular: String(p.priceRegular ?? ""),
      priceGroup: String(p.priceGroup ?? ""),
      categoryId: p.categoryId ?? "",
      isActive: Boolean(p.isActive),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  async function saveEdit(id: string) {
    if (!token) return;
    const n = String(draft.name ?? "").trim();
    if (!n) return alert("Name is required");

    const pr = String(draft.priceRegular ?? "").trim();
    const pg = String(draft.priceGroup ?? "").trim();
    if (!pr || !pg) return alert("Prices are required");

    setSavingId(id);
    try {
      await adminApi(`/admin/products/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          name: n,
          description: (draft.description ?? "") === "" ? null : String(draft.description),
          priceRegular: pr,
          priceGroup: pg,
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
    if (!token) return;
    const n = name.trim();
    if (!n) return alert("Name is required");
    if (!priceRegular.trim() || !priceGroup.trim()) return alert("Prices are required");

    setCreating(true);
    try {
      await adminApi("/admin/products", token, {
        method: "POST",
        body: JSON.stringify({
          name: n,
          description: description.trim() || null,
          priceRegular: priceRegular.trim(),
          priceGroup: priceGroup.trim(),
          isActive,
          categoryId: categoryId.trim() || null,
        }),
      });

      setName("");
      setDescription("");
      setPriceRegular("");
      setPriceGroup("");
      setCategoryId("");
      setIsActive(true);
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function onToggle(id: string) {
    if (!token) return;
    try {
      await adminApi(`/admin/products/${id}/toggle`, token, { method: "POST" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Toggle failed");
    }
  }

  async function onDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this product?")) return;
    try {
      await adminApi(`/admin/products/${id}`, token, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

  const rows = useMemo(() => items, [items]);

  if (!token) return <div className="card">Missing admin token. Login again.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="grid">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Products</h2>
          <button className="btn secondary" onClick={load}>Refresh</button>
        </div>

        <div className="hr" />

        <h3 style={{ marginTop: 0 }}>Add Product</h3>
        <div className="row" style={{ alignItems: "stretch", flexWrap: "wrap" }}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="input" placeholder="Price Regular" value={priceRegular} onChange={(e) => setPriceRegular(e.target.value)} />
          <input className="input" placeholder="Price Group" value={priceGroup} onChange={(e) => setPriceGroup(e.target.value)} />
          <input className="input" placeholder="Category ID (optional)" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />

          <label className="pill" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>

          <button className="btn" onClick={onCreate} disabled={creating}>
            {creating ? "Creating…" : "Add"}
          </button>
        </div>
      </div>

      <div className="card">
        <AdminTable
          columns={[
            { key: "id", title: "ID" },

            {
              key: "name",
              title: "Name",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input
                    className="input"
                    value={String(draft.name ?? "")}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                ) : (
                  p.name
                ),
            },

            {
              key: "description",
              title: "Description",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input
                    className="input"
                    value={String(draft.description ?? "")}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  />
                ) : (
                  p.description ?? ""
                ),
            },

            {
              key: "priceRegular",
              title: "Regular",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input
                    className="input"
                    value={String(draft.priceRegular ?? "")}
                    onChange={(e) => setDraft((d) => ({ ...d, priceRegular: e.target.value }))}
                  />
                ) : (
                  `₪${p.priceRegular}`
                ),
            },

            {
              key: "priceGroup",
              title: "Group",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input
                    className="input"
                    value={String(draft.priceGroup ?? "")}
                    onChange={(e) => setDraft((d) => ({ ...d, priceGroup: e.target.value }))}
                  />
                ) : (
                  `₪${p.priceGroup}`
                ),
            },

            {
              key: "categoryId",
              title: "CategoryId",
              render: (p: Product) =>
                editingId === p.id ? (
                  <input
                    className="input"
                    value={String(draft.categoryId ?? "")}
                    onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
                  />
                ) : (
                  p.categoryId ?? ""
                ),
            },

            {
              key: "isActive",
              title: "Active",
              render: (p: Product) =>
                editingId === p.id ? (
                  <label className="pill" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isActive)}
                      onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))}
                    />
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
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {!isEditing ? (
                      <>
                        <button className="btn secondary" type="button" onClick={() => startEdit(p)}>
                          Edit
                        </button>
                        <button className="btn secondary" type="button" onClick={() => onToggle(p.id)}>
                          Toggle Active
                        </button>
                        <button className="btn danger" type="button" onClick={() => onDelete(p.id)}>
                          Delete
                        </button>
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
