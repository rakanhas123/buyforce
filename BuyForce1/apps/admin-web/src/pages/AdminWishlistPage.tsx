import { useEffect, useState } from "react";
import AdminTable from "../ui/AdminTable";
<<<<<<< HEAD
import { useAdminAuth } from "../auth/AdminAuthContext";
=======
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
import { adminApi } from "../lib/adminApiClient";

type WishRow = {
  id: string;
<<<<<<< HEAD
  user_id?: string;
  userId?: string;
  email?: string | null;
  product_id?: string;
=======
  userId?: string;
  email?: string | null;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  productId?: string;
  productName?: string | null;
  createdAt?: string | null;
};

export default function AdminWishlistPage() {
<<<<<<< HEAD
  const { token } = useAdminAuth();
=======
  const hasKey = !!localStorage.getItem("ADMIN_KEY");

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const [items, setItems] = useState<WishRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
<<<<<<< HEAD
      const data = await adminApi<{ items: WishRow[] }>("/admin/wishlist", token);
=======
      const data = await adminApi<{ items: WishRow[] }>("/admin/wishlist");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load wishlist");
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

  async function onDelete() {
    if (!token) return;
    if (!confirm("Delete wishlist item?")) return;
    await adminApi(`/admin/wishlist/`, token, { method: "DELETE" });
    await load();
  }

  if (!token) return <div className="card">Missing admin token. Login again.</div>;
=======
  }, [hasKey]);

  async function onDelete(id: string) {
    if (!confirm("Delete wishlist item?")) return;
    try {
      await adminApi(`/admin/wishlist/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    }
  }

  if (!hasKey) return <div className="card">Missing admin token. Login again.</div>;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
<<<<<<< HEAD
          { key: "productId", title: "ProductId", render: (r: WishRow) => r.productId ?? r.product_id ?? "" },
=======
          { key: "productId", title: "ProductId" },
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
          { key: "productName", title: "Product" },
          {
            key: "_actions",
            title: "Actions",
            render: (r: WishRow) => (
<<<<<<< HEAD
              <button className="btn danger" type="button" onClick={() => onDelete()}>
=======
              <button className="btn danger" type="button" onClick={() => onDelete(r.id)}>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
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
