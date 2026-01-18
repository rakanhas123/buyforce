import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

type Props = {
  id: string;
  name: string;
  priceRegular: number | string;
  priceGroup: number | string;
  progress: number; // 0-100
  imageUrl?: string | null;
};

export default function ProductCard({
  id,
  name,
  priceRegular,
  priceGroup,
  progress,
  imageUrl,
}: Props) {
  const regular = Number(priceRegular);
  const group = Number(priceGroup);

  const safeRegular = Number.isFinite(regular) ? regular : 0;
  const safeGroup = Number.isFinite(group) ? group : 0;

  const discount =
    safeRegular > 0
      ? Math.max(0, Math.round(((safeRegular - safeGroup) / safeRegular) * 100))
      : 0;

  return (
    <Link to={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#f3f3f3",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontWeight: 900 }}>{name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900 }}>{name}</div>

            <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "baseline" }}>
              <div style={{ fontWeight: 900 }}>₪{safeGroup}</div>
              <div className="muted" style={{ textDecoration: "line-through" }}>
                ₪{safeRegular}
              </div>
              <div className="muted">{discount}% off</div>
            </div>

            <div style={{ marginTop: 10 }}>
              <ProgressBar value={progress} />
              <div className="muted" style={{ marginTop: 6 }}>
                {Math.round(progress)}% to goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
