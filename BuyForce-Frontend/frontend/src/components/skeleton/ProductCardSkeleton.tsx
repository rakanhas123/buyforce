export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="product-image skeleton-box" />

      <div className="product-info">
        <div className="skeleton-line title" />
        <div className="skeleton-line price" />
        <div className="skeleton-bar" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}
