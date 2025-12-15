import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================
   Static Data
========================= */
const suggestions = [
  "AirPods Pro",
  "iPhone 15",
  "PlayStation 5",
  "Sony Headphones",
  "Wireless Earbuds",
];

const trendingSearches = [
  "iPhone 15",
  "AirPods Pro",
  "PlayStation 5",
  "Apple Watch",
];

/* =========================
   Props
========================= */
type Props = {
  onClose: () => void;
};

/* =========================
   Component
========================= */
export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  /* ---------- Autocomplete ---------- */
  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  /* ---------- Search Action ---------- */
  const goSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    onClose();
  };

  /* ---------- UI ---------- */
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

        {/* Trending + Recent */}
        {!query && (
          <div className="search-suggestions">
            {/* Trending */}
            <div className="section">
              <p className="title">🔥 Trending</p>
              <div className="chips">
                {trendingSearches.map((t) => (
                  <button key={t} onClick={() => goSearch(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            {recentSearches.length > 0 && (
              <div className="section">
                <p className="title">🕒 Recent</p>
                <div className="chips">
                  {recentSearches.map((r) => (
                    <button key={r} onClick={() => goSearch(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Autocomplete */}
        {query && (
          <ul className="autocomplete">
            {filteredSuggestions.map((s) => (
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
