import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/skeleton/ProductCardSkeleton";
import SearchOverlay from "../../components/search/SearchOverlay";
import TrendingCategories from "../../components/category/TrendingCategories";

/* =========================
   Mock Data
========================= */
const mockProducts = [
  {
    id: 1,
    name: "AirPods Pro",
    price: 699,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 87,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "iPhone 15",
    price: 3999,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 42,
    goalMembers: 100,
  },
  {
    id: 3,
    name: "PlayStation 5",
    price: 2299,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 12,
    goalMembers: 100,
  },
  {
    id: 4,
    name: "Sony Headphones",
    price: 899,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 55,
    goalMembers: 100,
  },
  {
    id: 5,
    name: "Apple Watch",
    price: 1499,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 61,
    goalMembers: 100,
  },
  {
    id: 6,
    name: "Nintendo Switch",
    price: 1299,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 33,
    goalMembers: 100,
  },
];

/* =========================
   Constants
========================= */
const NEAR_GOAL_THRESHOLD = 70;

/* =========================
   Sorting Types
========================= */
type SortOption = "closest" | "newest" | "discount";

export default function HomePage() {
  /* =========================
     States
  ========================= */
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("closest");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const navigate = useNavigate();

  /* =========================
     Fake Loading
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     Infinite Scroll
  ========================= */
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => prev + 3);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     Calculate Progress
  ========================= */
  const productsWithProgress = mockProducts.map((p) => {
    const progress = Math.round(
      (p.currentMembers / p.goalMembers) * 100
    );
    return { ...p, progress };
  });

  /* =========================
     Near Goal / Deals Split
  ========================= */
  const nearGoalProducts = productsWithProgress.filter(
    (p) => p.progress >= NEAR_GOAL_THRESHOLD
  );

  const dealProducts = productsWithProgress.filter(
    (p) => p.progress < NEAR_GOAL_THRESHOLD
  );

  /* =========================
     Sorting Function
  ========================= */
  const sortProducts = (products: typeof productsWithProgress) => {
    switch (sortBy) {
      case "closest":
        return [...products].sort((a, b) => b.progress - a.progress);
      case "newest":
        return [...products].sort((a, b) => b.id - a.id);
      case "discount":
        return [...products].sort((a, b) => b.progress - a.progress);
      default:
        return products;
    }
  };

  return (
    <div className="home-page">

      {/* 🔍 Search + ❤️ Wishlist */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setIsSearchOpen(true)}>
          🔍 Search
        </button>

        <button onClick={() => navigate("/wishlist")}>
          ❤️ Wishlist
        </button>
      </div>

      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}

      {/* 🔥 Near Goal */}
      <section>
        <h2>🔥 Near Goal</h2>

        <div className="grid">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : nearGoalProducts.length === 0 ? (
            <p>No products close to goal yet</p>
          ) : (
            nearGoalProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
                currentMembers={p.currentMembers}
                goalMembers={p.goalMembers}
                isNearGoal={true}
              />
            ))
          )}
        </div>
      </section>

      {/* 🔥 Trending Categories */}
      <TrendingCategories />

      {/* 💥 Market Breaking Deals */}
      <section>
        <h2>💥 Market Breaking Deals</h2>

        <div className="sort-bar">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortOption)
            }
          >
            <option value="closest">Closest to Goal</option>
            <option value="newest">Newest</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        <div className="grid">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : (
            sortProducts(dealProducts)
              .slice(0, visibleCount)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  imageUrl={p.imageUrl}
                  currentMembers={p.currentMembers}
                  goalMembers={p.goalMembers}
                />
              ))
          )}
        </div>
      </section>

    </div>
  );
}
