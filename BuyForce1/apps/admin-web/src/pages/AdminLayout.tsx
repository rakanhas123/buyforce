import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link to={to}>
      <button className={`btn ${active ? "" : "secondary"}`}>{label}</button>
    </Link>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function onLogout() {
    logout();
    nav("/login");
  }

  return (
    <div>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="badge">A</div>
            <div>BuyForce Admin</div>

            <div className="nav" style={{ marginLeft: 12 }}>
              <NavLink to="/admin/groups" label="Groups" />
              <NavLink to="/admin/users" label="Users" />
              <NavLink to="/admin/wishlist" label="Wishlists" />
            </div>
          </div>

          <div className="row">
            <span className="muted">{user?.fullName ?? user?.email ?? "Admin"}</span>
            <button className="btn danger" onClick={onLogout}>
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
