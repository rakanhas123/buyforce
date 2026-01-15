import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyGroups, type Group } from "../../api/groupsApi";
export default function MyGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
const list = await getMyGroups(); // Group[]
setGroups(list);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return groups;
    return groups.filter((g) => {
      const id = String(g.id ?? "").toLowerCase();
      const pid = String((g as any).productId ?? "").toLowerCase();
      const status = String((g as any).status ?? "").toLowerCase();
      return id.includes(s) || pid.includes(s) || status.includes(s);
    });
  }, [groups, q]);

  if (loading) return <div className="card">Loading…</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>My Groups</h2>
        <input
          className="input"
          placeholder="Search by id / productId / status…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card">No groups yet.</div>
      ) : (
        <div className="cards">
          {filtered.map((g) => (
            <div key={g.id} className="card">
              <div style={{ fontWeight: 900 }}>Group: {g.id}</div>
              <div className="hr" />
              <Link to={`/groups/${g.id}`} className="btn">
                Open
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
