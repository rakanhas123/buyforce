import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteWishlist, getWishlist, type WishlistItem } from "../../api/wishlistApi";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await getWishlist());
    } catch (e: any) {
      setError(e?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onRemove(productId: string) {
    if (!confirm("Remove from wishlist?")) return;
    try {
      await deleteWishlist(productId);
      await load();
    } catch (e: any) {
      alert(e?.message || "Remove failed");
    }
  }

  return (
    <div>
      <h2>Wishlist</h2>
      <div style={{ opacity: 0.75, marginBottom: 12 }}>
        Products you saved with ❤️
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ opacity: 0.75 }}>Your wishlist is empty.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {items.map((it) => (
            <div key={it.id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 14, padding: 14 }}>
              <div style={{ fontWeight: 900 }}>
                {it.productName ?? "Product"}
              </div>

              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                Product ID: {it.productId}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <Link
                  to={`/products/${it.productId}`}
                  style={{
                    flex: 1,
                    textDecoration: "none",
                    textAlign: "center",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    fontWeight: 900,
                  }}
                >
                  Open
                </Link>

                <button
                  onClick={() => onRemove(it.productId)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #c0392b",
                    background: "#c0392b",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
