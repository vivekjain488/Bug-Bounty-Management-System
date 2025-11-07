import axios from 'axios';

// API Configuration
// In production, use the Render backend URL
// In development, use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout for slow network
});

// Add token to requests
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

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (credentials) => {
    console.log('🌐 API: Sending login request to backend...', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('📨 API: Login response received:', response.data);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      console.log('💾 API: Token and user saved to localStorage');
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return { success: true, message: 'Logged out successfully' };
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const localUser = localStorage.getItem('currentUser');
      return localUser ? JSON.parse(localUser) : null;
    }
  },
  
  updateProfile: async (updatedData) => {
    const response = await api.put('/auth/me', updatedData);
    if (response.data.success) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/auth/me');
    if (response.data.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  
  getById: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },
  
  submit: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  update: async (reportId, updates) => {
    const response = await api.put(`/reports/${reportId}`, updates);
    return response.data;
  },
  
  updateStatus: async (reportId, status, reward, feedback) => {
    const response = await api.put(`/reports/${reportId}/status`, {
      status,
      reward,
      feedback
    });
    return response.data;
  },
  
  delete: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/reports/stats/my');
    return response.data;
  }
};

// Programs API
export const programsAPI = {
  getAll: async () => {
    const response = await api.get('/programs');
    return response.data;
  },
  
  getById: async (programId) => {
    const response = await api.get(`/programs/${programId}`);
    return response.data;
  },
  
  create: async (programData) => {
    const response = await api.post('/programs', programData);
    return response.data;
  },
  
  update: async (programId, updates) => {
    const response = await api.put(`/programs/${programId}`, updates);
    return response.data;
  },
  
  delete: async (programId) => {
    const response = await api.delete(`/programs/${programId}`);
    return response.data;
  },
  
  getMyPrograms: async () => {
    const response = await api.get('/programs/company/my');
    return response.data;
  }
};

