import { useEffect, useState } from "react";
import http from "../api/http";

type Group = {
  id: string;
  name: string;
  description?: string;
  joinedCount: number;
  minParticipants: number;
  progress: number;
  status: "OPEN" | "LOCKED" | "CHARGED" | "FAILED";
};

const STATUSES: Group["status"][] = ["OPEN", "LOCKED", "CHARGED", "FAILED"];

export default function AdminGroupsPage() {
  const [items, setItems] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minParticipants, setMinParticipants] = useState<number>(3);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await http.get("/v1/admin/groups");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate() {
    if (!name.trim()) return alert("Name required");
    try {
      setCreating(true);
      await http.post("/v1/admin/groups", {
        name: name.trim(),
        description: description.trim() || undefined,
        minParticipants: Number(minParticipants),
      });
      setName("");
      setDescription("");
      setMinParticipants(3);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function onForceStatus(groupId: string, status: Group["status"]) {
    try {
      await http.post(`/v1/admin/groups/${groupId}/status`, { status });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Status update failed");
    }
  }

  async function onEdit(groupId: string, patch: Partial<Group>) {
    try {
      await http.patch(`/v1/admin/groups/${groupId}`, patch);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Edit failed");
    }
  }

  async function onDelete(groupId: string) {
    if (!confirm("Delete this group?")) return;
    try {
      await http.delete(`/v1/admin/groups/${groupId}`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Delete failed");
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Groups</h2>
        <div className="muted">Create groups, edit them, and force status.</div>

        <div className="hr" />

        <div className="grid" style={{ gap: 10 }}>
          <div className="row">
            <input className="input" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
            <input
              className="input"
              placeholder="minParticipants"
              type="number"
              value={minParticipants}
              onChange={(e) => setMinParticipants(Number(e.target.value))}
              style={{ maxWidth: 160 }}
            />
          </div>

          <input
            className="input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <button className="btn" onClick={onCreate} disabled={creating}>
              {creating ? "Creating..." : "Create Group"}
            </button>
            <button className="btn secondary" onClick={load}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="cards">
          {items.map((g) => (
            <div className="card" key={g.id}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div style={{ fontWeight: 900 }}>{g.name}</div>
                <span className="muted">{g.status}</span>
              </div>

              {g.description && <div className="muted" style={{ marginTop: 6 }}>{g.description}</div>}

              <div className="muted" style={{ marginTop: 10 }}>
                {g.joinedCount}/{g.minParticipants} • {g.progress}%
              </div>

              <div className="hr" />

              {/* Edit fields (quick inline) */}
              <div className="grid" style={{ gap: 8 }}>
                <input
                  className="input"
                  defaultValue={g.name}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== g.name) onEdit(g.id, { name: v });
                  }}
                />
                <input
                  className="input"
                  defaultValue={g.description ?? ""}
                  placeholder="Description"
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== (g.description ?? "")) onEdit(g.id, { description: v || undefined });
                  }}
                />
                <input
                  className="input"
                  defaultValue={g.minParticipants}
                  type="number"
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v >= 1 && v !== g.minParticipants) {
                      onEdit(g.id, { minParticipants: v } as any);
                    }
                  }}
                />
              </div>

              <div className="hr" />

              {/* Force status */}
              <div className="row">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`btn ${s === g.status ? "" : "secondary"}`}
                    onClick={() => onForceStatus(g.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="hr" />

              <button className="btn danger" onClick={() => onDelete(g.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
