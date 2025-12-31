import { Link } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>BuyForce Web</h2>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>Hi, {user.fullName}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>

      <p>✅ You are logged in and ready to build groups/products pages.</p>
    </div>
  );
}
