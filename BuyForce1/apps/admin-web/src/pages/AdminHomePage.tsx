import { useEffect, useState } from "react";
import { adminApi } from "../lib/adminApiClient";

export default function AdminHomePage() {
  const [sections, setSections] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminApi<any[]>("/home/sections")
      .then(setSections)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Home Sections</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(sections, null, 2)}</pre>
    </div>
  );
}
