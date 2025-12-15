import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/skeleton/ProductCardSkeleton";
import { getProductsByCategory } from "../../api/productsApi";

/* =========================
   Types
========================= */
type SortOption = "closest" | "newest" | "discount";

/* =========================
   Component
========================= */
export default function CategoryPage() {
  /* ---------- URL Param ---------- */
  const { name } = useParams();
  const categoryName = decodeURIComponent(name || "");

  /* ---------- State ---------- */
  const [products, setProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("closest");
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Fetch Products by Category ---------- */
  useEffect(() => {
    if (!categoryName) return;

    setIsLoading(true);

    getProductsByCategory(categoryName)
      .then((data) => {
        // התאמת שדות Backend → Frontend
        const adapted = data.map((p: any) => ({
          ...p,
          imageUrl: p.main_image,
        }));

        setProducts(adapted);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, [categoryName]);

  /* ---------- Guard ---------- */
  if (!categoryName) {
    return <p style={{ padding: 24 }}>Category not found</p>;
  }

  /* ---------- Add Progress ---------- */
  const productsWithProgress = products.map((p) => ({
    ...p,
    progress: Math.round((p.currentMembers / p.goalMembers) * 100),
  }));

  /* ---------- Sorting ---------- */
  const sortProducts = () => {
    switch (sortBy) {
      case "closest":
        return [...productsWithProgress].sort(
          (a, b) => b.progress - a.progress
        );
      case "newest":
        return [...productsWithProgress].sort((a, b) => b.id - a.id);
      case "discount":
        return [...productsWithProgress].sort(
          (a, b) => b.progress - a.progress
        );
      default:
        return productsWithProgress;
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="home-page">
      <h2>🗂 {categoryName}</h2>

      {/* Sort Bar */}
      <div className="sort-bar">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="closest">Closest to Goal</option>
          <option value="newest">Newest</option>
          <option value="discount">Highest Discount</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && productsWithProgress.length === 0 && (
        <p>No products in this category yet.</p>
      )}

      {/* Products Grid */}
      {!isLoading && productsWithProgress.length > 0 && (
        <div className="grid">
          {sortProducts().map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              currentMembers={p.currentMembers}
              goalMembers={p.goalMembers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
