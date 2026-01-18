import { useEffect, useState } from "react";
import { fetchProducts, fetchProductGroup } from "../api/productsApi";
import type { Product } from "../lib/types";
import ProductCard from "../ui/ProductCard";

export default function ProductPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [progressById, setProgressById] = useState<Record<string, number>>({});
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(async (prods) => {
        const list = Array.isArray(prods) ? prods : [];
        setItems(list);

        const pairs = await Promise.all(
          list.map(async (p) => {
            try {
              const g = await fetchProductGroup(p.id);
              return [p.id, Number(g.progress ?? 0)] as const;
            } catch {
              return [p.id, 0] as const;
            }
          })
        );

        const map: Record<string, number> = {};
        for (const [id, prog] of pairs) map[id] = prog;
        setProgressById(map);
      })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!items.length) return <div className="card">No products yet.</div>;

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            priceRegular={p.priceRegular}
            priceGroup={p.priceGroup}
            progress={progressById[p.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
