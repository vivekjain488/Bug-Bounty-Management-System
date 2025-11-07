import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://bug-bounty-management-system-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔗 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear session and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ===================================
// Authentication API
// ===================================
export const authAPI = {
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, ...response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
      return { success: true, ...response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    return { success: true, message: 'Logged out successfully' };
  },

  updateProfile: async (userId, updatedData) => {
    try {
      const response = await api.put(`/auth/profile/${userId}`, updatedData);
      if (response.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
      return { success: true, ...response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  },

  deleteAccount: async (userId) => {
    try {
      await api.delete(`/auth/user/${userId}`);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      return { success: true, message: 'Account deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Deletion failed' 
      };
    }
  }
};

// ===================================
// Programs API
// ===================================
export const programsAPI = {
  create: async (programData) => {
    try {
      const response = await api.post('/programs', programData);
      return { success: true, program: response.data.program };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create program' 
      };
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/programs');
      return response.data.programs || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  },

  getById: async (programId) => {
    try {
      const response = await api.get(`/programs/${programId}`);
      return response.data.program || null;
    } catch (error) {
      console.error('Error fetching program:', error);
      return null;
    }
  },

  getMyPrograms: async () => {
    try {
      const response = await api.get('/programs/company/my');
      return response.data.programs || [];
    } catch (error) {
      console.error('Error fetching my programs:', error);
      return [];
    }
  },

  update: async (programId, updatedData) => {
    try {
      const response = await api.put(`/programs/${programId}`, updatedData);
      return { success: true, program: response.data.program };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update program' 
      };
    }
  },

  delete: async (programId) => {
    try {
      await api.delete(`/programs/${programId}`);
      return { success: true, message: 'Program deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete program' 
      };
    }
  }
};

// ===================================
// Reports API
// ===================================
export const reportsAPI = {
  create: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return { success: true, report: response.data.report };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to submit report' 
      };
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/reports');
      return response.data.reports || response.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  getById: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data.report || null;
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  },

  getMyReports: async () => {
    try {
      const response = await api.get('/reports/my');
      return response.data.reports || [];
    } catch (error) {
      console.error('Error fetching my reports:', error);
      return [];
    }
  },

  getByProgram: async (programId) => {
    try {
      const response = await api.get(`/reports/program/${programId}`);
      return response.data.reports || [];
    } catch (error) {
      console.error('Error fetching program reports:', error);
      return [];
    }
  },

  update: async (reportId, updatedData) => {
    try {
      const response = await api.put(`/reports/${reportId}`, updatedData);
      return { success: true, report: response.data.report };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update report' 
      };
    }
  },

  updateStatus: async (reportId, statusData) => {
    try {
      const response = await api.patch(`/reports/${reportId}/status`, statusData);
      return { success: true, report: response.data.report };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update status' 
      };
    }
  },

  delete: async (reportId) => {
    try {
      await api.delete(`/reports/${reportId}`);
      return { success: true, message: 'Report deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete report' 
      };
    }
  }
};

// ===================================
// Payments API
// ===================================
export const paymentsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/payments');
      return response.data.payments || [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  },

  markAsPaid: async (reportId) => {
    try {
      const response = await api.post(`/payments/${reportId}/process`);
      return { success: true, payment: response.data.payment };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to process payment' 
      };
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/payments/stats');
      return response.data.stats || {};
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return {};
    }
  }
};

export default api;