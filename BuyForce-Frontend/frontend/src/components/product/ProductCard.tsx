type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  inWishlist?: boolean;
  onToggleWishlist?: () => void;
};

export default function ProductCard({
  name,
  price,
  imageUrl,
  inWishlist,
  onToggleWishlist,
}: Props) {
  return (
    <div className="product-card">
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      <p>{price} ₪</p>
      {onToggleWishlist && (
        <button onClick={onToggleWishlist}>
          {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </button>
      )}
    </div>
  );
}
