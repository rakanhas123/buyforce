import { useLocation } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";

const mockResults = [
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
    name: "Sony Headphones",
    price: 899,
    imageUrl: "https://via.placeholder.com/400x300",
    currentMembers: 55,
    goalMembers: 100,
  },
];

export default function SearchResultsPage() {
  const query = new URLSearchParams(useLocation().search).get("q") || "";

  return (
    <div className="home-page">
      <h2>
        Search results for: <strong>{query}</strong>
      </h2>

      <div className="grid">
        {mockResults.map((p) => (
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
