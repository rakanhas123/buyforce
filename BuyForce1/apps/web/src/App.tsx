import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./app/lib/AuthContext";

function NavButton({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #333",
          background: active ? "#111" : "#fff",
          color: active ? "#fff" : "#111",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </Link>
  );
}

export default function App() {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  function onLogout() {
    logout();
    nav("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "1px solid #333",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
              title="BuyForce"
            >
              B
            </div>

<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
  <NavButton to="/" label="Home" />
  <NavButton to="/categories" label="Categories" />
  <NavButton to="/products" label="Products" />
  <NavButton to="/my-groups" label="My Groups" />
  <NavButton to="/notifications" label="Notifications" />
  <NavButton to="/search" label="Search" />
  <NavButton to="/groups" label="Groups" />
  <NavButton to="/wishlist" label="Wishlist" />
</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, opacity: 0.75 }}>
              {user?.fullName ?? "User"}
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #c0392b",
                background: "#c0392b",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "18px 16px" }}>
        <Outlet />
      </main>
    </div>
  );
}
