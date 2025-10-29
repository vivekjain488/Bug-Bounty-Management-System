// Multi-role authentication utilities (User, Company, Triage)
import { authAPI } from './api.js';

export const signup = async (userData) => {
  try {
    return await authAPI.signup(userData);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' };
  }
};

export const login = async (credentials) => {
  try {
    return await authAPI.login(credentials);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};

export const logout = () => {
  return authAPI.logout();
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null && localStorage.getItem('token') !== null;
};

export const updateUserProfile = async (updatedData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    
    return await authAPI.updateProfile(updatedData);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Update failed' };
  }
};

export const deleteUserAccount = async (userId) => {
  try {
    return await authAPI.deleteAccount();
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Delete failed' };
  }
};

// Role-specific helper functions
export const isUser = () => {
  const user = getCurrentUser();
  return user && user.role === 'user';
};

export const isCompany = () => {
  const user = getCurrentUser();
  return user && user.role === 'company';
};

export const isTriageTeam = () => {
  const user = getCurrentUser();
  return user && user.role === 'triage';
};

export const getUsersByRole = async (role) => {
  // This would need a backend endpoint to fetch users by role
  return [];
};

export const getRedirectPath = (user) => {
  if (!user) return '/';
  
  switch (user.role) {
    case 'user':
      return '/dashboard';
    case 'company':
      return '/company-dashboard';
    case 'triage':
      return '/triage-dashboard';
    default:
      return '/dashboard';
  }
};
