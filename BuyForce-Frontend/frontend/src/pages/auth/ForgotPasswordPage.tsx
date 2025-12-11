import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseClient";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your email.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Email</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
