import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// For Android emulator use 10.0.2.2
// For iOS simulator use localhost
// For real device use your computer's IP address
const getBaseURL = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  
  console.log('🔍 debuggerHost:', debuggerHost);
  console.log('🔍 Platform.OS:', Platform.OS);
  
  // Force use WiFi IP for testing
  const WIFI_IP = '192.168.160.126';
  
  // If running on real device, use the debugger host IP
  if (debuggerHost && !debuggerHost.includes('localhost')) {
    console.log('✅ Using real device IP:', debuggerHost);
    return `http://${debuggerHost}:3000`;
  }
  
  // For Android emulator
  if (Platform.OS === 'android') {
    console.log('🤖 Using Android Emulator IP');
    return 'http://10.0.2.2:3000'; // Android Emulator
  }
  
  // For iOS simulator or fallback
  console.log('📱 Using fallback (WiFi IP)');
  return `http://${WIFI_IP}:3000`;
};

const API_URL = getBaseURL();
console.log('API_URL:', API_URL, 'Platform:', Platform.OS);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // We'll add AsyncStorage token later
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
  stock_quantity: number;
  created_at: string;
  category?: {
    id: number;
    name: string;
  };
  images?: Array<{
    id: number;
    image_url: string;
    is_main: boolean;
  }>;
  specs?: Array<{
    id: number;
    spec_key: string;
    spec_value: string;
  }>;
}

export interface Group {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
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
    console.log('🔐 authApi.login called with:', credentials.email);
    console.log('🌐 API URL:', API_URL);
    try {
      const { data } = await api.post('/v1/auth/login', credentials);
      console.log('✅ Login response received:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Login API error:', error.response?.data || error.message);
      throw error;
    }
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
  getAll: async (categoryId?: number): Promise<Product[]> => {
    const params = categoryId ? { categoryId } : {};
    const { data } = await api.get('/api/products', { params });
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
    const { data } = await api.get('/api/groups');
    return data;
  },

  getById: async (id: number): Promise<Group> => {
    const { data } = await api.get(`/api/groups/${id}`);
    return data;
  },

  join: async (groupId: number): Promise<void> => {
    await api.post(`/api/groups/${groupId}/join`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/api/categories');
    return data;
  },
};

// Health Check
export const healthCheck = async () => {
  try {
    const { data } = await api.get('/v1/health');
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Set auth token for authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
