import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

function Nav({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button
        type="button"
        className={`btn ${active ? "" : "secondary"}`}
      >
        {label}
      </button>
    </Link>
  );
}

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const nav = useNavigate();

  function onLogout() {
    logout();
    nav("/admin/login", { replace: true });
  }

  function onRefresh() {
    // refresh current page data by reloading the route (hard refresh)
    window.location.reload();
  }

  return (
    <div>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="badge">A</div>
            <div style={{ fontWeight: 900 }}>Admin</div>

            <div className="nav" style={{ marginLeft: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Nav to="/admin/dashboard" label="Dashboard" />
              <Nav to="/admin/products" label="Products" />
              <Nav to="/admin/categories" label="Categories" />
              <Nav to="/admin/notifications" label="Notifications" />
              <Nav to="/admin/users" label="Users" />
              <Nav to="/admin/groups" label="Groups" />
              <Nav to="/admin/wishlist" label="Wishlist" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn secondary" onClick={onRefresh}>
              Refresh
            </button>
            <button type="button" className="btn danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
