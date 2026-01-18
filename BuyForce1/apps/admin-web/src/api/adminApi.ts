<<<<<<< HEAD
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1";

export async function adminApi<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
=======
const BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

type ApiError = Error & { status?: number };

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const adminKey = localStorage.getItem("ADMIN_KEY") || "";

  const url = `${BASE}/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-KEY": adminKey, // ✅ THIS IS THE IMPORTANT PART
      ...(init?.headers || {}),
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    },
  });

  const text = await res.text();
  let data: any = null;
<<<<<<< HEAD
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
=======
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const err: ApiError = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  }

  return data as T;
}
