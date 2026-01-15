import { useEffect, useState } from "react";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

type Notif = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  createdAt: string;
};

export default function AdminNotificationsPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setErr(null);
        const data = await adminApi<{ items: Notif[] }>("/admin/notifications", token);
        setItems(data.items ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Failed");
      }
    })();
  }, [token]);

  if (!token) return null;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Notifications</h2>

      {items.length === 0 ? (
        <div className="muted">No notifications.</div>
      ) : (
        <div className="cards">
          {items.map((n) => (
            <div key={n.id} className="card">
              <div style={{ fontWeight: 900 }}>{n.title}</div>
              <div className="muted">{n.type}</div>
              <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
              {n.body ? <div style={{ marginTop: 8 }}>{n.body}</div> : null}
              {n.link ? <div className="muted" style={{ marginTop: 8 }}>Link: {n.link}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
