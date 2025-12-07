import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const itemAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  search: (keyword, params) => api.get('/items/search', { params: { keyword, ...params } }),
  getByCategory: (categoryId, params) => api.get(`/items/category/${categoryId}`, { params }),
  getUserItems: (userId, params) => api.get(`/items/user/${userId}`, { params }),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

export const messageAPI = {
  getAll: () => api.get('/messages'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  send: (data) => api.post('/messages', data),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

export const favoriteAPI = {
  getAll: () => api.get('/favorites'),
  check: (itemId) => api.get(`/favorites/check/${itemId}`),
  add: (itemId) => api.post(`/favorites/${itemId}`),
  remove: (itemId) => api.delete(`/favorites/${itemId}`),
};

export default api;
