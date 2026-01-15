export default function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ width: "100%", height: 10, background: "#eee", borderRadius: 999 }}>
      <div style={{ width: `${v}%`, height: 10, background: "#111", borderRadius: 999 }} />
    </div>
  );
}
