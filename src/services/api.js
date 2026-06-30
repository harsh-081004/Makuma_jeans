import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('makuma_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If we didn't even get a response, the server is likely down
    if (!error.response) {
      throw new Error('Cannot connect to the server. Please ensure the backend is running.');
    }
    
    // Handle 401 Unauthorized globally
    if (error.response.status === 401) {
      localStorage.removeItem('makuma_token');
      localStorage.removeItem('makuma_admin');
      
      // Only redirect if not already on the login page to avoid loops
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    // Extract the server-provided error message if available
    const message = error.response.data?.message || 'Request failed';
    throw new Error(message);
  }
);

// ─── Auth ───
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  setup: (data) => api.post('/auth/setup', data),
  me: () => api.get('/auth/me'),
};

// ─── Products ───
export const productsAPI = {
  list: (params = '') => api.get(`/products${params ? `?${params}` : ''}`),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── Categories ───
export const categoriesAPI = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Inquiries ───
export const inquiriesAPI = {
  submit: (data) => api.post('/inquiries', data),
  list: (params = '') => api.get(`/inquiries${params ? `?${params}` : ''}`),
  updateStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status }),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

// ─── Upload ───
export const uploadAPI = {
  single: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Settings ───
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// ─── Lookbook ───
export const lookbookAPI = {
  list: () => api.get('/lookbook'),
  create: (data) => api.post('/lookbook', data),
  update: (id, data) => api.put(`/lookbook/${id}`, data),
  delete: (id) => api.delete(`/lookbook/${id}`),
};

// ─── Health ───
export const healthAPI = {
  check: () => api.get('/health'),
};

