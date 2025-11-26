import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// Waste API
export const wasteAPI = {
  getAll: (params?: { status?: string; type?: string }) =>
    api.get('/api/waste', { params }),
  
  getById: (id: string) =>
    api.get(`/api/waste/${id}`),
  
  getMyListings: () =>
    api.get('/api/waste/my/listings'),
  
  create: (data: FormData) =>
    api.post('/api/waste', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.put(`/api/waste/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/waste/${id}/status`, { status }),
  
  delete: (id: string) =>
    api.delete(`/api/waste/${id}`),
};
