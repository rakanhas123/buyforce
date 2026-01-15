import { useEffect, useState } from "react";
import { fetchHomeSections } from "../../api/homeApi";
import ProductCard from "../../ui/ProductCard";

type Section = {
  key: string;
  title: string;
  items: any[];
};

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await fetchHomeSections();
        if (alive) setSections(data);
      } catch (e: any) {
        if (alive) setErr(e.message || "Failed to load home");
      }
    }

    load();
    const timer = setInterval(load, 5000); // 🔁 refresh every 5s

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="grid">
      {sections.map((s) => (
        <div key={s.key} className="card">
          <h2 style={{ marginTop: 0 }}>{s.title}</h2>

          {s.items.length === 0 ? (
            <div className="muted">No items in this section yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {s.items.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  priceRegular={p.priceRegular}
                  priceGroup={p.priceGroup}
                  progress={p.group?.progress ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
