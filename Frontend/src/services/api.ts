import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data: { title: string; category: string; level: string; current_progress: number; goal_progress: number; notes?: string }) =>
    api.post('/skills', data),
  update: (id: string, data: Partial<{ title: string; category: string; level: string; current_progress: number; goal_progress: number; notes: string }>) =>
    api.put(`/skills/${id}`, data),
  patchProgress: (id: string, current_progress: number) =>
    api.patch(`/skills/${id}/progress`, { current_progress }),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export default api;
