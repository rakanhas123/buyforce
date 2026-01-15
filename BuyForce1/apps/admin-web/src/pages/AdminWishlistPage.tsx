import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type WishRow = {
  id: string;
  user_id?: string;
  userId?: string;
  email?: string | null;
  product_id?: string;
  productId?: string;
  productName?: string | null;
  createdAt?: string | null;
};

export default function AdminWishlistPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<WishRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await adminApi<{ items: WishRow[] }>("/admin/wishlist", token);
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onDelete() {
    if (!token) return;
    if (!confirm("Delete wishlist item?")) return;
    await adminApi(`/admin/wishlist/`, token, { method: "DELETE" });
    await load();
  }

  if (!token) return <div className="card">Missing admin token. Login again.</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Wishlist</h2>
        <button className="btn secondary" onClick={load}>Refresh</button>
      </div>

      <div className="hr" />

      <AdminTable
        columns={[
          { key: "id", title: "ID" },
          { key: "email", title: "User Email" },
          { key: "productId", title: "ProductId", render: (r: WishRow) => r.productId ?? r.product_id ?? "" },
          { key: "productName", title: "Product" },
          {
            key: "_actions",
            title: "Actions",
            render: (r: WishRow) => (
              <button className="btn danger" type="button" onClick={() => onDelete()}>
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
