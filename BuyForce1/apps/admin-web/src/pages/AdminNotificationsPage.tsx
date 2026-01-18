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
<<<<<<< HEAD
  const { token } = useAdminAuth();
=======
  const { adminKey } = useAdminAuth();
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const [items, setItems] = useState<Notif[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    if (!token) return;
=======
    if (!adminKey) return;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

    (async () => {
      try {
        setErr(null);
<<<<<<< HEAD
        const data = await adminApi<{ items: Notif[] }>("/admin/notifications", token);
=======
        const data = await adminApi<{ items: Notif[] }>("/admin/notifications");
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
        setItems(data.items ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Failed");
      }
    })();
<<<<<<< HEAD
  }, [token]);

  if (!token) return null;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
=======
  }, [adminKey]);

  if (!adminKey) return <div className="card">Not logged in. Go to Admin Login.</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1

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
