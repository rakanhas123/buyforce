import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../api/categoriesApi";

type Category = { id: string; name: string; slug: string };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setItems).catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div>
      <h2>Categories</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {items.map((c) => (
          <Link key={c.id} to={`/categories/${c.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ padding: 14, border: "1px solid #ddd", borderRadius: 14, background: "#fff" }}>
              <div style={{ fontWeight: 900 }}>{c.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{c.slug}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
