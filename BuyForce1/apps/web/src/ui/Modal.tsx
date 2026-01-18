export default function Modal(props: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!props.open) return null;

  return (
    <div
      onClick={props.onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #ddd",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{props.title}</h3>
          <button onClick={props.onClose} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "6px 10px" }}>
            ✕
          </button>
        </div>

        <div style={{ marginTop: 12 }}>{props.children}</div>
      </div>
    </div>
  );
}
