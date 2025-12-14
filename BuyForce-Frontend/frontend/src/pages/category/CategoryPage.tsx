import { useState } from "react";
import ProductCard from "../../components/product/ProductCard";

const mockProducts = [
  {
    id: 1,
    name: "AirPods Pro",
    price: 699,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 87,
    goalMembers: 100,
    category: "Audio",
  },
  {
    id: 2,
    name: "Sony Headphones",
    price: 899,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 55,
    goalMembers: 100,
    category: "Audio",
  },
  {
    id: 3,
    name: "PlayStation 5",
    price: 2299,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 20,
    goalMembers: 100,
    category: "Gaming",
  },
];

type SortOption = "closest" | "newest" | "discount";

export default function CategoryPage() {
  const [sortBy, setSortBy] = useState<SortOption>("closest");

  const productsWithProgress = mockProducts.map((p) => ({
    ...p,
    progress: Math.round((p.currentMembers / p.goalMembers) * 100),
  }));

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

  return (
    <div className="home-page">
      <h2>🎧 Audio</h2>

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
    </div>
  );
}
