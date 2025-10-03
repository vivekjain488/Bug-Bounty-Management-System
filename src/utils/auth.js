// localStorage-based authentication utilities

export const signup = (userData) => {
  const { username, email, password, fullName } = userData;
  
  // Check if user already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find(u => u.email === email || u.username === username);
  
  if (existingUser) {
    return { success: false, message: 'User already exists' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, hash this!
    fullName,
    bio: '',
    skills: [],
    reportsSubmitted: 0,
    totalEarnings: 0,
    rank: 'Beginner',
    joinedDate: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return { success: true, message: 'Account created successfully', user: newUser };
};

export const login = (credentials) => {
  const { email, password } = credentials;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }
  
  // Set current user session
  const userSession = { ...user };
  delete userSession.password; // Don't store password in session
  localStorage.setItem('currentUser', JSON.stringify(userSession));
  
  return { success: true, message: 'Login successful', user: userSession };
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  return { success: true, message: 'Logged out successfully' };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const updateUserProfile = (updatedData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'Not authenticated' };
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Update user data
  users[userIndex] = { ...users[userIndex], ...updatedData };
  localStorage.setItem('users', JSON.stringify(users));
  
  // Update session
  const updatedUser = { ...users[userIndex] };
  delete updatedUser.password;
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
  return { success: true, message: 'Profile updated', user: updatedUser };
};


// Authentication utilities with MockAPI integration
import { usersAPI } from './api';

export const signup = async (userData) => {
  try {
    const { username, email, password, fullName } = userData;
    
    // Check if user already exists
    const existingUserByEmail = await usersAPI.findByEmail(email);
    const existingUserByUsername = await usersAPI.findByUsername(username);
    
    if (existingUserByEmail) {
      return { success: false, message: 'Email already exists' };
    }
    
    if (existingUserByUsername) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Create new user
    const newUser = {
      username,
      email,
      password, // In production, hash this!
      fullName,
      bio: '',
      skills: [],
      reportsSubmitted: 0,
      totalEarnings: 0,
      rank: 'Beginner',
      joinedDate: new Date().toISOString(),
    };
    
    const response = await usersAPI.create(newUser);
    
    return { success: true, message: 'Account created successfully', user: response.data };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to create account. Please try again.' };
  }
};

export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Find user by email
    const user = await usersAPI.findByEmail(email);
    
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Set current user session
    const userSession = { ...user };
    delete userSession.password; // Don't store password in session
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    return { success: true, message: 'Login successful', user: userSession };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  return { success: true, message: 'Logged out successfully' };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const updateUserProfile = async (updatedData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    
    // Update user in MockAPI
    const response = await usersAPI.update(currentUser.id, {
      ...currentUser,
      ...updatedData,
      password: currentUser.password // Keep original password
    });
    
    // Update session
    const updatedUser = { ...response.data };
    delete updatedUser.password;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return { success: true, message: 'Profile updated', user: updatedUser };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Failed to update profile' };
  }
};

export const deleteUserAccount = async (userId) => {
  try {
    await usersAPI.delete(userId);
    logout();
    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, message: 'Failed to delete account' };
  }
};
