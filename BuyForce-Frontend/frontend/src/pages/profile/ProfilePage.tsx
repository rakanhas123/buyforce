import { useState } from "react";
import type { FormEvent } from "react";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { profile, loading, updateNameAndLanguage } = useUser();
  const { logout } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [language, setLanguage] = useState(profile?.language ?? "he");

  if (loading || !profile) return <div>Loading profile...</div>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateNameAndLanguage(fullName, language);
  };

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Language
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "he" | "en" | "ar")}
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </label>

        <button type="submit">Save</button>
      </form>

      <h2>Payment Methods (read-only)</h2>
      <ul>
        {profile.paymentMethods.map((pm) => (
          <li key={pm.id}>
            {pm.type.toUpperCase()} •••• {pm.last4}
          </li>
        ))}
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
