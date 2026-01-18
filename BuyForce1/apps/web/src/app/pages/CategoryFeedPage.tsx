import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategoryFeed } from "../../api/categoriesApi";
import type { Product } from "../../lib/types";
import ProductCard from "../../ui/ProductCard";

export default function CategoryFeedPage() {
  const { slug } = useParams();
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchCategoryFeed(slug)
      .then((p) => setItems(Array.isArray(p) ? p : []))
      .catch((e) => setErr(e.message));
  }, [slug]);

  if (!slug) return <div className="card">Missing category slug</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!items.length) return <div className="card">No products in this category yet.</div>;

  return (
    <div>
      <h2>{slug}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            priceRegular={p.priceRegular}
            priceGroup={p.priceGroup}
            progress={0}
          />
        ))}
      </div>
    </div>
  );
}
