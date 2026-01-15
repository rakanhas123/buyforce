import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markRead, type NotificationItem } from "../../api/notificationsApi";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const data = await getNotifications();
      setItems(data.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    }
  }

  useEffect(() => { load(); }, []);

  async function onRead(id: string) {
    await markRead(id);
    await load();
  }

  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Notifications</h2>
      <button className="btn secondary" onClick={load}>Refresh</button>

      <div className="hr" />

      {items.length === 0 ? (
        <div className="muted">No notifications yet.</div>
      ) : (
        <div className="cards">
          {items.map((n) => (
            <div key={n.id} className="card">
              <div style={{ fontWeight: 900 }}>
                {n.isRead ? "✅" : "🟠"} {n.title}
              </div>
              {n.body && <div className="muted" style={{ marginTop: 6 }}>{n.body}</div>}

              <div className="row" style={{ marginTop: 10 }}>
                {n.link ? (
                  <Link className="btn secondary" to={n.link}>Open</Link>
                ) : null}
                {!n.isRead ? (
                  <button className="btn" onClick={() => onRead(n.id)}>Mark read</button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
