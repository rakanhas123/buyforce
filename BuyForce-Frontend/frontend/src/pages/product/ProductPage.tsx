import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductPage() {
  /* ---------- URL Param ---------- */
  const { id } = useParams();

  /* ---------- State ---------- */
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Wishlist ---------- */
  const { toggleWishlist, isInWishlist } = useWishlist();

  /* ---------- Fetch Product ---------- */
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    getProductById(id)
      .then((data) => {
        if (!data) {
          setProduct(null);
          return;
        }

        // התאמת שדות Backend → Frontend
        setProduct({
          ...data,
          imageUrl: data.main_image,
        });
      })
      .catch(() => {
        setError("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- States ---------- */
  if (loading) {
    return <p style={{ padding: 24 }}>Loading product...</p>;
  }

  if (error) {
    return <p style={{ padding: 24 }}>{error}</p>;
  }

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Product not found 😕</h2>
        <p>The product may have been removed or is unavailable.</p>
      </div>
    );
  }

  /* ---------- Progress ---------- */
  const progress = Math.round(
    (product.currentMembers / product.goalMembers) * 100
  );

  /* ---------- UI ---------- */
  return (
    <div className="product-page" style={{ padding: 24 }}>
      {/* Title */}
      <h1>{product.name}</h1>

      {/* Wishlist */}
      <button
        className={`wishlist-btn ${
          isInWishlist(product.id) ? "active" : ""
        }`}
        onClick={() => toggleWishlist(product)}
        style={{ marginBottom: 16 }}
      >
        ♥
      </button>

      {/* Image with Placeholder */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          height: 250,
          background: "#f2f2f2",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/placeholder.png";
          }}
        />
      </div>

      {/* Price */}
      <p style={{ fontSize: 20, fontWeight: "bold" }}>
        {product.price} ₪
      </p>

      {/* Progress */}
      <div style={{ margin: "16px 0" }}>
        <div
          style={{
            height: 10,
            background: "#eee",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#4caf50",
            }}
          />
        </div>
        <small>
          {product.currentMembers} / {product.goalMembers} joined
        </small>
      </div>

      {/* Join Button */}
      <button className="join-btn" style={{ marginBottom: 24 }}>
        Join for 1₪
      </button>

      {/* Specs */}
      <h3>Specifications</h3>
      <ul>
        <li>Category: {product.category || "N/A"}</li>
        <li>Brand: {product.brand || "N/A"}</li>
        <li>Warranty: 12 months</li>
      </ul>
    </div>
  );
}
