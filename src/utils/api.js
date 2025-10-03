import axios from 'axios';

// MockAPI base URL
const BASE_URL = 'https://68df8c5f898434f4135811a3.mockapi.io/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  findByEmail: async (email) => {
    const response = await api.get('/users');
    return response.data.find(user => user.email === email);
  },
  findByUsername: async (username) => {
    const response = await api.get('/users');
    return response.data.find(user => user.username === username);
  },
};

export const reportsAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (reportData) => api.post('/reports', reportData),
  update: (id, reportData) => api.put(`/reports/${id}`, reportData),
  delete: (id) => api.delete(`/reports/${id}`),
  getByUserId: async (userId) => {
    const response = await api.get('/reports');
    return response.data.filter(report => report.userId === userId);
  },
};

export default api;

