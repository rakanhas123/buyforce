import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface Group {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/v1/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/v1/auth/register', userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/v1/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/v1/auth/me');
    return data;
  },
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/api/products');
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },
};

// Groups API
export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const { data } = await api.get('/v1/groups');
    return data;
  },

  getById: async (id: number): Promise<Group> => {
    const { data } = await api.get(`/v1/groups/${id}`);
    return data;
  },

  join: async (groupId: number): Promise<void> => {
    await api.post(`/v1/groups/${groupId}/join`);
  },
};

// Health Check
export const healthCheck = async () => {
  const { data } = await api.get('/v1/health');
  return data;
};

// Set auth token for authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Legacy export for compatibility
export async function getProducts() {
  return productsApi.getAll();
}

export default api;
