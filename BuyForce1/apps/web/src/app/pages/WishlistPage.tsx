import { useEffect, useState } from "react";
import { addWishlist, deleteWishlist, getWishlist, type WishlistItem } from "../../api/wishlistApi";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await getWishlist());
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd() {
    const n = name.trim();
    const u = url.trim();

    if (!n) {
      setError("Name is required");
      return;
    }

    setAdding(true);
    setError(null);
    try {
      await addWishlist(n, u || undefined);
      setName("");
      setUrl("");
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to add item");
    } finally {
      setAdding(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete item?")) return;
    try {
      await deleteWishlist(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Delete failed");
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Wishlist</h2>
        <div className="muted">Add items you want your group to buy.</div>

        <div className="hr" />

        <div className="row" style={{ alignItems: "stretch" }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
            />
          </div>

          <div style={{ flex: 3, minWidth: 260 }}>
            <input
              className="input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Optional URL"
            />
          </div>

          <button className="btn" onClick={onAdd} disabled={adding}>
            {adding ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}
      </div>

      {loading ? (
        <div className="card">Loading…</div>
      ) : items.length === 0 ? (
        <div className="card">
          <div className="muted">Your wishlist is empty.</div>
        </div>
      ) : (
        <div className="cards">
          {items.map((it) => (
            <div key={it.id} className="card">
              <div style={{ fontWeight: 900 }}>{it.name}</div>

              {it.url ? (
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 8, textDecoration: "underline" }}
                >
                  Open link
                </a>
              ) : (
                <div className="muted" style={{ marginTop: 8 }}>No URL</div>
              )}

              <div className="hr" />

              <button className="btn danger" onClick={() => onDelete(it.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
