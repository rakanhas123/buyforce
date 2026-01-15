import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { search } from "../../api/searchApi";

 
export default function SearchPage() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      const s = q.trim();
      if (!s) return setRes({ products: [], categories: [] });
      try {
        setErr(null);
        setRes(await search(s));
      } catch (e: any) {
        setErr(e?.message ?? "Search failed");
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Search</h2>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products/categories…" />
        {err && <div style={{ color: "crimson", marginTop: 10 }}>{err}</div>}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Categories</h3>
        {res.categories.length === 0 ? (
          <div className="muted">No categories.</div>
        ) : (
          res.categories.map((c) => (
            <div key={c.id}>
              <Link to={`/categories/${c.slug}`}>{c.name}</Link>
            </div>
          ))
        )}

        <div className="hr" />

        <h3 style={{ marginTop: 0 }}>Products</h3>
        {res.products.length === 0 ? (
          <div className="muted">No products.</div>
        ) : (
          res.products.map((p) => (
            <div key={p.id}>
              <Link to={`/products/${p.id}`}>{p.name}</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
