export default function AdminTable({
  columns,
  rows,
}: {
  columns: { key: string; title: string; render?: (row: any) => any }[];
  rows: any[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
<<<<<<< HEAD
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: "left",
                  padding: "10px 8px",
                  borderBottom: "1px solid #ddd",
                  fontSize: 13,
                  opacity: 0.8,
                }}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
=======
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.title}</th>
            ))}
          </tr>
        </thead>

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id ?? idx}>
              {columns.map((c) => (
<<<<<<< HEAD
                <td key={c.key} style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>
                  {c.render ? c.render(r) : String(r[c.key] ?? "")}
                </td>
=======
                <td key={c.key}>{c.render ? c.render(r) : String(r?.[c.key] ?? "")}</td>
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
