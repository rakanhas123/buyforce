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

export default function AppLayout() {
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
            <div className="badge">B</div>
            <div>BuyForce</div>

            <div className="nav" style={{ marginLeft: 12 }}>
              <NavLink to="/groups" label="Groups" />
              <NavLink to="/wishlist" label="Wishlist" />
            </div>
          </div>

          <div className="nav">
            <span className="muted">{user?.fullName ?? user?.email}</span>
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
