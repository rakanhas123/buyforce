import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Audio",
    image: "https://images.unsplash.com/photo-1518441902117-f1d0a4d0f9c7",
  },
  {
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    name: "Gaming",
    image: "https://images.unsplash.com/photo-1606813902917-ff6c7d44a6a3",
  },
  {
    name: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
];

export default function TrendingCategories() {
  const navigate = useNavigate();

  return (
    <section className="trending-categories">
      <h2>🔥 Trending Categories</h2>

      <div className="category-grid">
        {categories.map((c) => (
          <div
            key={c.name}
            className="category-card"
            onClick={() =>
              navigate(`/category/${encodeURIComponent(c.name)}`)
            }
          >
            <img src={c.image} alt={c.name} />
            <div className="overlay">
              <span>{c.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
