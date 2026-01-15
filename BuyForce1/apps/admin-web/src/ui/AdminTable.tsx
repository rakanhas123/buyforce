export default function AdminTable({
  columns,
  rows,
}: {
  columns: { key: string; title: string; render?: (row: any) => any }[];
  rows: any[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
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
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id ?? idx}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "10px 8px", borderBottom: "1px solid #eee" }}>
                  {c.render ? c.render(r) : String(r[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
