import { useEffect, useState } from "react";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { adminApi } from "../lib/adminApiClient";

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState({ users: 0, groups: 0, wishlist: 0, notifications: 0 });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setErr(null);
        const [u, g, w, n] = await Promise.all([
          adminApi<{ items: any[] }>("/admin/users", token),
          adminApi<{ items: any[] }>("/admin/groups", token),
          adminApi<{ items: any[] }>("/admin/wishlist", token),
          adminApi<{ items: any[] }>("/admin/notifications", token),
        ]);

        setStats({
          users: u.items?.length ?? 0,
          groups: g.items?.length ?? 0,
          wishlist: w.items?.length ?? 0,
          notifications: n.items?.length ?? 0,
        });
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [token]);

  if (err) return <div className="card" style={{ color: "crimson" }}>{err}</div>;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div>Users: {stats.users}</div>
      <div>Groups: {stats.groups}</div>
      <div>Wishlist: {stats.wishlist}</div>
      <div>Notifications: {stats.notifications}</div>
    </div>
  );
}
