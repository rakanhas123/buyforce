import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getGroups, getMyGroups, joinGroup, leaveGroup, type Group } from "../../api/groupsApi";

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div style={{ marginTop: 10 }}>
      <div className="muted">{v}%</div>
      <div className="progress">
        <div style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [all, mine] = await Promise.all([getGroups(), getMyGroups()]);
      setGroups(all);
      setMyGroups(mine);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const joinedSet = useMemo(() => new Set(myGroups.map((g) => g.id)), [myGroups]);

  async function onJoin(groupId: string) {
    try {
      setJoining(groupId);
      await joinGroup(groupId);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Join failed");
    } finally {
      setJoining(null);
    }
  }

  async function onLeave(groupId: string) {
    try {
      if (!confirm("Leave this group?")) return;
      setLeaving(groupId);
      await leaveGroup(groupId);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Leave failed");
    } finally {
      setLeaving(null);
    }
  }

  if (loading) return <div className="card">Loading groups…</div>;
  if (error) return <div className="card" style={{ color: "crimson" }}>{error}</div>;

  return (
    <div className="grid">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Groups</h2>
            <div className="muted">Join groups, track progress, and pay when ready.</div>
          </div>
          <button className="btn secondary" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>My Groups</h3>

        {myGroups.length === 0 ? (
          <div className="muted">You haven’t joined any groups yet.</div>
        ) : (
          <div className="cards">
            {myGroups.map((g) => (
              <div key={g.id} className="card">
                <Link to={`/groups/${g.id}`} style={{ fontWeight: 900 }}>
                  {g.name ?? "Unnamed group"}
                </Link>

                <div style={{ marginTop: 8 }} className="pill">
                  <span>👥 {g.joinedCount}/{g.minParticipants}</span>
                  <span>•</span>
                  <span>{g.status}</span>
                </div>

                <ProgressBar value={g.progress} />

                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <Link to={`/groups/${g.id}`}>
                    <button className="btn secondary" type="button">View</button>
                  </Link>

                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => onLeave(g.id)}
                    disabled={leaving === g.id}
                  >
                    {leaving === g.id ? "Leaving…" : "Leave"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>All Groups</h3>

        {groups.length === 0 ? (
          <div className="muted">No groups found.</div>
        ) : (
          <div className="cards">
            {groups.map((g) => {
              const isJoined = joinedSet.has(g.id);

              return (
                <div key={g.id} className="card">
                  <Link to={`/groups/${g.id}`} style={{ fontWeight: 900 }}>
                    {g.name ?? "Unnamed group"}
                  </Link>

                  <div style={{ marginTop: 8 }} className="pill">
                    <span>👥 {g.joinedCount}/{g.minParticipants}</span>
                    <span>•</span>
                    <span>{g.status}</span>
                  </div>

                  <ProgressBar value={g.progress} />

                  <button
                    className={`btn ${isJoined ? "secondary" : ""}`}
                    type="button"
                    onClick={() => onJoin(g.id)}
                    disabled={joining === g.id || isJoined}
                    style={{ marginTop: 12, width: "100%" }}
                  >
                    {isJoined ? "Joined ✅" : joining === g.id ? "Joining…" : "Join"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
