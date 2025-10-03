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

export const deleteUserAccount = (userId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'Not authenticated' };
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(filteredUsers));
  
  logout();
  return { success: true, message: 'Account deleted successfully' };
};
