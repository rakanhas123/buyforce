import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct, fetchProductGroup, joinGroup } from "../api/productsApi";
import { addWishlist, deleteWishlist, hasWishlist } from "../api/wishlistApi";
import type { Group, Product } from "../lib/types";
import ProgressBar from "../ui/ProgressBar";

export default function ProductDetailsPage() {
const { id: rawId } = useParams<{ id: string }>();
const id = rawId ?? "";

  const [product, setProduct] = useState<Product | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  const [wish, setWish] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const [p, g, w] = await Promise.all([
          fetchProduct(id),
          fetchProductGroup(id),
          hasWishlist(id).catch(() => ({ has: false })),
        ]);
        if (cancelled) return;
        setProduct(p);
        setGroup(g);
        setWish(Boolean(w.has));
      } catch (e: any) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onJoin() {
    if (!group) return;
    setJoining(true);
    setErr(null);
    try {
      await joinGroup(group.id);
      // רענון קבוצה אחרי join
      const g2 = await fetchProductGroup(group.productId);
      setGroup(g2);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setJoining(false);
    }
  }

  async function toggleWish() {
    if (!id) return;
    try {
      if (wish) await deleteWishlist(id);
      else await addWishlist(id);
      setWish(!wish);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  if (!id) return <div className="card">Missing product id in URL</div>;
  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!product || !group) return <div className="card">Not found</div>;

  const regular = Number(product.priceRegular);
  const groupPrice = Number(product.priceGroup);
  const discount = regular > 0 ? Math.round(((regular - groupPrice) / regular) * 100) : 0;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ marginTop: 0 }}>{product.name}</h2>
          <div className="muted">{product.description}</div>
        </div>

        <button className={`btn ${wish ? "" : "secondary"}`} onClick={toggleWish}>
          {wish ? "❤️ Saved" : "♡ Save"}
        </button>
      </div>

      <div className="hr" />

      <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
        <div style={{ fontWeight: 900 }}>₪{isNaN(groupPrice) ? product.priceGroup : groupPrice}</div>
        <div className="muted" style={{ textDecoration: "line-through" }}>
          ₪{isNaN(regular) ? product.priceRegular : regular}
        </div>
        <div className="muted">{discount}% off</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <ProgressBar value={Number(group.progress ?? 0)} />
        <div className="muted" style={{ marginTop: 6 }}>
          {group.joinedCount}/{group.minParticipants} joined • {group.progress}% to goal • {group.status}
        </div>
      </div>

      <div className="hr" />

      <button className="btn" onClick={onJoin} disabled={joining || group.status !== "OPEN"}>
        {joining ? "Joining..." : "Join for 1₪"}
      </button>
    </div>
  );
}
