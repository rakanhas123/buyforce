import { getToken } from "./auth";

/* ================= Types ================= */

export type User = {
  id: string;
  fullName?: string;
  email: string;
};

export type Category = {
  id: string;
  name: string;
  slug?: string | null;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;

  priceRegular?: number | string | null;
  priceGroup?: number | string | null;

  categoryId?: string | null;
  category?: { id: string; name: string } | null;

  images?: Array<{ image_url: string; is_main?: boolean }>;
};

export type GroupStatus = "OPEN" | "LOCKED" | "CHARGED" | "FAILED" | "COMPLETED";

export type Group = {
  id: string;
  name: string;
  status: GroupStatus;

  productId: string;

  minParticipants: number;
  joinedCount: number;
  progress?: number;

  createdAt?: string;
  endsAt?: string;

  isJoined?: boolean;
  canPay?: boolean;

  // Optional product fields (sometimes returned in /my)
  productName?: string;
  priceRegular?: number | string | null;
  priceGroup?: number | string | null;
};

export type WishlistItem = {
  id?: string;
  productId: string;
  createdAt?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link?: string | null;
  is_read?: boolean;
  createdAt?: string;
  created_at?: string;
};

/* ================= Base fetch ================= */

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/v1";

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = AUTH_TOKEN_OVERRIDE ?? (await getToken());
  const headers: Record<string, string> = {
    ...(opts.headers as any),
  };

  if (!headers["Content-Type"] && opts.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

function unwrapItems<T>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.items)) return data.items as T[];
  if (Array.isArray(data?.item)) return data.item as T[]; // rare but safe
  return [];
}

/* ================= AUTH ================= */
let AUTH_TOKEN_OVERRIDE: string | null = null;

export function setAuthToken(token: string | null) {
  AUTH_TOKEN_OVERRIDE = token;
}
export const authApi = {
  async login(email: string, password: string): Promise<{ accessToken: string; user: User }> {
    const data = await apiFetch<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return {
      accessToken: data?.accessToken ?? data?.token,
      user: data?.user,
    };
  },

  async register(fullName: string, email: string, password: string): Promise<{ accessToken: string; user: User }> {
    const data = await apiFetch<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password }),
    });
    return {
      accessToken: data?.accessToken ?? data?.token,
      user: data?.user,
    };
  },

  async me(): Promise<User> {
    const data = await apiFetch<any>("/auth/me", { method: "GET" });
    return (data?.item ?? data?.user ?? data) as User;
  },
};

/* ================= CATEGORIES ================= */

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const data = await apiFetch<any>("/categories", { method: "GET" });
    return unwrapItems<Category>(data);
  },
};

/* ================= PRODUCTS ================= */

export const productsApi = {
  // ✅ ALWAYS returns Product[]
  async getAll(): Promise<Product[]> {
    const data = await apiFetch<any>("/products", { method: "GET" });
    return unwrapItems<Product>(data);
  },

async getById(id: string): Promise<Product> {
  const data = await apiFetch<any>(`/products/${encodeURIComponent(id)}`, { method: "GET" });
  return (data?.item ?? data) as Product;
},

  // OPTIONAL: only works if backend exists: GET /v1/groups/by-product/:productId
  async getGroupForProduct(productId: string): Promise<Group> {
    const data = await apiFetch<any>(`/groups/by-product/${encodeURIComponent(productId)}`, { method: "GET" });
    return (data?.item ?? data) as Group;
  },
};

/* ================= GROUPS ================= */

export const groupsApi = {
  async getAll(): Promise<Group[]> {
    const data = await apiFetch<any>("/groups", { method: "GET" });
    return unwrapItems<Group>(data);
  },

  async getMy(): Promise<Group[]> {
    const data = await apiFetch<any>("/groups/my", { method: "GET" });
    return unwrapItems<Group>(data);
  },

async getById(id: string): Promise<Group> {
  const data = await apiFetch<any>(`/groups/${encodeURIComponent(id)}`, { method: "GET" });
  return (data?.item ?? data) as Group;
},

  async create(input: { name: string; productId: string; minParticipants: number; endsAt: string }): Promise<{ id: string }> {
    return apiFetch<{ id: string }>("/groups", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async join(groupId: string): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/groups/${encodeURIComponent(groupId)}/join`, { method: "POST" });
  },

  async leave(groupId: string): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/groups/${encodeURIComponent(groupId)}/leave`, { method: "DELETE" });
  },
};

/* ================= WISHLIST ================= */

export const wishlistApi = {
  // ✅ ALWAYS returns WishlistItem[]
  async getAll(): Promise<WishlistItem[]> {
    const data = await apiFetch<any>("/wishlist", { method: "GET" });
    const arr = unwrapItems<any>(data);

    // normalize productId
    return arr
      .map((x) => ({
        id: x?.id,
        productId: String(x?.productId ?? x?.product_id ?? x?.product?.id ?? ""),
        createdAt: x?.createdAt ?? x?.created_at,
      }))
      .filter((x) => x.productId);
  },

  async add(productId: string): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/wishlist/${encodeURIComponent(productId)}`, { method: "POST" });
  },

  async remove(productId: string): Promise<{ ok: true }> {
    return apiFetch<{ ok: true }>(`/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
  },
};

/* ================= NOTIFICATIONS ================= */

export const notificationsApi = {
  // ✅ ALWAYS returns NotificationItem[]
  async getAll(): Promise<NotificationItem[]> {
    const data = await apiFetch<any>("/notifications", { method: "GET" });
    return unwrapItems<NotificationItem>(data);
  },
};

/* ================= PAYMENTS ================= */

export const paymentsApi = {
  async checkout(groupId: string, platform: "mobile" | "web" = "mobile"): Promise<{ url: string }> {
    return apiFetch<{ url: string }>(`/payments/checkout`, {
      method: "POST",
      body: JSON.stringify({ groupId, platform }),
    });
  },
};
