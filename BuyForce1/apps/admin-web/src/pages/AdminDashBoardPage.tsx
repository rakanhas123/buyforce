import { useEffect, useState } from "react";
import { adminApi } from "../lib/adminApiClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    groups: 0,
    wishlist: 0,
    notifications: 0,
  });
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);

        // ✅ use server-side dashboard endpoint (best)
        const data = await adminApi<{
          users: number;
          groups: number;
          wishlist: number;
          notifications: number;
        }>("/admin/dashboard");

        setStats({
          users: data.users ?? 0,
          groups: data.groups ?? 0,
          wishlist: data.wishlist ?? 0,
          notifications: data.notifications ?? 0,
        });
      } catch (e: any) {
        setErr(e?.message || "Failed to load dashboard");
      }
    })();
  }, []);

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
