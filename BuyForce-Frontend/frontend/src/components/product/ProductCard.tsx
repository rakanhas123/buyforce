import { useWishlist } from "../../context/WishlistContext";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  currentMembers?: number;
  goalMembers?: number;
  isNearGoal?: boolean;
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  currentMembers = 0,
  goalMembers = 100,
  isNearGoal = false,
}: Props) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const progress = Math.min(
    100,
    Math.round((currentMembers / goalMembers) * 100)
  );

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}

        {/* {isNearGoal && (
          <span className="near-goal-badge">Almost There</span>
        )} */}
        <button
          className={`wishlist-btn ${
            isInWishlist(id) ? "active" : ""
          }`}
          onClick={() =>
            toggleWishlist({
              id,
              name,
              price,
              imageUrl,
              currentMembers,
              goalMembers,
            })
          }
        >
          ♥
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <h3>{name}</h3>
        <p className="price">{price} ₪</p>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <small>
            {currentMembers} / {goalMembers} joined
          </small>
        </div>

        <button className="join-btn">Join for 1₪</button>
      </div>
    </div>
  );
}
