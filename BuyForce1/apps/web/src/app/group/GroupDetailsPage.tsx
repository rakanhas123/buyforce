import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getGroupById, joinGroup, leaveGroup } from "../../api/groupsApi";
import PayNowButton from "../../components/PayNowButton";

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

export default function GroupDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(groupId: string) {
    try {
      setError(null);
      setLoading(true);
      const item = await getGroupById(groupId);
      setGroup(item);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setError("Missing group id");
      setLoading(false);
      return;
    }
    load(id);
  }, [id]);

  async function onJoin() {
    if (!id) return;
    try {
      setJoining(true);
      await joinGroup(id);
      await load(id);
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Join failed");
    } finally {
      setJoining(false);
    }
  }

  async function onLeave() {
    if (!id) return;
    if (!confirm("Leave this group?")) return;

    try {
      setLeaving(true);
      await leaveGroup(id);
      nav("/groups");
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Leave failed");
    } finally {
      setLeaving(false);
    }
  }

  if (loading) return <div className="card">Loading…</div>;
  if (error) return <div className="card" style={{ color: "crimson" }}>{error}</div>;
  if (!group) return <div className="card">Not found</div>;

  const canPay = !!group.canPay;

  return (
    <div className="grid">
      <div className="card">
        <Link to="/groups" className="muted">← Back to Groups</Link>

        <h2 style={{ marginTop: 10, marginBottom: 6 }}>{group.name}</h2>
        {group.description && <div className="muted">{group.description}</div>}

        <div className="hr" />

        <div className="row">
          <span className="pill">👥 {group.joinedCount}/{group.minParticipants}</span>
          <span className="pill">Status: {group.status}</span>
          {group.endsAt && <span className="pill">Ends: {new Date(group.endsAt).toLocaleString()}</span>}
        </div>

        <ProgressBar value={group.progress ?? 0} />

        <div className="hr" />

        {/* Actions */}
        {!group.isJoined ? (
          <button className="btn" onClick={onJoin} disabled={joining}>
            {joining ? "Joining…" : "Join group"}
          </button>
        ) : (
          <div className="row">
            <button className="btn danger" onClick={onLeave} disabled={leaving}>
              {leaving ? "Leaving…" : "Leave group"}
            </button>

            {/* ONLY show pay inside details, only when joined */}
            {canPay ? (
              <PayNowButton groupId={group.id} />
            ) : (
              <button
                className="btn secondary"
                disabled
                title="Payment unlocks when participants reach the minimum"
              >
                Pay locked (need more users)
              </button>
            )}
          </div>
        )}

        {!canPay && group.isJoined && (
          <div className="muted" style={{ marginTop: 10 }}>
            Payment unlocks when participants reach the minimum.
          </div>
        )}
      </div>
    </div>
  );
}
