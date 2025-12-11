import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getWishlist, removeFromWishlist } from "../../api/wishlistApi";
import ProductCard from "../../components/product/ProductCard";

export default function WishlistPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const data = await getWishlist(token);
      setItems(data);
    };
    load();
  }, [token]);

  const handleRemove = async (productId: number) => {
    if (!token) return;
    await removeFromWishlist(token, productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <div>
      <h1>My Wishlist</h1>
      <div className="grid">
        {items.map((item) => (
          <ProductCard
            key={item.productId}
            id={item.productId}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            inWishlist={true}
            onToggleWishlist={() => handleRemove(item.productId)}
          />
        ))}
      </div>
    </div>
  );
}
