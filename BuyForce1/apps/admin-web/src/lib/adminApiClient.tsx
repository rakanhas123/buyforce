const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

type ApiError = Error & { status?: number };

export async function adminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const adminKey = localStorage.getItem("ADMIN_KEY") || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as any),
  };

  if (adminKey) headers["X-ADMIN-KEY"] = adminKey;

  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const err: ApiError = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data as T;
}
