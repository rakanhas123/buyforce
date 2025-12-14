import ProductCard from "../../components/product/ProductCard";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  // 🟢 Empty State
  if (wishlist.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your wishlist is empty 💔</h2>
        <p>Start saving products you love</p>
      </div>
    );
  }

  // 🟢 Wishlist עם מוצרים אמיתיים
  return (
    <div className="home-page">
      <h2>❤️ Your Wishlist</h2>
      <div className="grid">
        {wishlist.map((p) => (
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
