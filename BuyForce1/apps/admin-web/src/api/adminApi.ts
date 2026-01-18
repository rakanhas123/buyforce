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
    },
  });

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
