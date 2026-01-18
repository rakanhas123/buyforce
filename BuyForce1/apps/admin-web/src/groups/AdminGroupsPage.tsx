import { useEffect, useState } from "react";
import { adminApi } from "../lib/adminApiClient";

export default function AdminGroupsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminApi<any>("/admin/groups")
      .then((data) => setItems(data.items ?? data ?? []))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Admin Groups</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
