import { useNavigate } from "react-router-dom";
import { useState } from "react";

const suggestions = [
  "AirPods Pro",
  "iPhone 15",
  "PlayStation 5",
  "Sony Headphones",
  "Wireless Earbuds",
];

type Props = {
  onClose: () => void;
};

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const goSearch = (value: string) => {
    if (!value.trim()) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    onClose();
  };

  return (
    <div className="search-overlay">
      <div className="search-box">
        <input
          autoFocus
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goSearch(query)}
        />

        {query && (
          <ul className="autocomplete">
            {filtered.map((s) => (
              <li key={s} onClick={() => goSearch(s)}>
                <strong>{s.slice(0, query.length)}</strong>
                {s.slice(query.length)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
