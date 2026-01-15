const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

type ApiError = Error & { status?: number };

export async function adminApi<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as any),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });

  const text = await res.text(); // helps when backend returns HTML 404
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // if it's HTML 404 page etc
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const err: ApiError = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data as T;
}
