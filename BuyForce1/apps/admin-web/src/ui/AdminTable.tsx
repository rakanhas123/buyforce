export default function AdminTable({
  columns,
  rows,
}: {
  columns: { key: string; title: string; render?: (row: any) => any }[];
  rows: any[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id ?? idx}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(r) : String(r?.[c.key] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
