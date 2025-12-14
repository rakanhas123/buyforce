import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProductById } from "../../api/productsApi";


export default function ProductPage() {
    console.log("🔥 ProductPage rendered");

    const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((data) => {
        if (!data) {
          setProduct(null);
          return;
        }

        // 🔧 התאמת שדות מה-Backend ל-Frontend
        setProduct({
          ...data,
          imageUrl: data.main_image, // ← זה החלק שהיה חסר
        });
      })
      .catch(() => {
        setError("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 🟡 Loading state
  if (loading) {
    return <p>Loading product...</p>;
  }

  // 🔴 Error state
  if (error) {
    return <p>{error}</p>;
  }

  // ⚪ Empty / Not found state
  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Product not found 😕</h2>
        <p>The product may have been removed or is unavailable.</p>
      </div>
    );
  }

  // 🟢 Success
  return (
    <div className="home-page">
      <ProductCard
        id={product.id}
        name={product.name}
        price={product.price}
        imageUrl={product.imageUrl}
        currentMembers={product.currentMembers}
        goalMembers={product.goalMembers}
      />
    </div>
  );
}

