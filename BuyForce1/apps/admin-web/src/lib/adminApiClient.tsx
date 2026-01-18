<<<<<<< HEAD
const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

type ApiError = Error & { status?: number };

export async function adminApi<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}/v1${path.startsWith("/") ? "" : "/"}${path}`;

=======
const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

type ApiError = Error & { status?: number };

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const adminKey = localStorage.getItem("ADMIN_KEY") || "";

>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as any),
  };

<<<<<<< HEAD
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  const text = await res.text(); // helps when backend returns HTML 404
=======
  if (adminKey) headers["X-ADMIN-KEY"] = adminKey;

  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
<<<<<<< HEAD
    // if it's HTML 404 page etc
=======
>>>>>>> 80a7a01eea5db8b4b711d140ba83600cce5b5fc1
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const err: ApiError = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data as T;
}
