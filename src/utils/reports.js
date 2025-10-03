// Report management utilities using localStorage

export const submitReport = (reportData) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  
  const newReport = {
    id: Date.now().toString(),
    ...reportData,
    submittedAt: new Date().toISOString(),
    status: 'Pending Review',
    reward: null,
    feedback: null,
  };
  
  reports.push(newReport);
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update user stats
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (currentUser) {
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].reportsSubmitted = (users[userIndex].reportsSubmitted || 0) + 1;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current session
      currentUser.reportsSubmitted = users[userIndex].reportsSubmitted;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }
  
  return { success: true, message: 'Report submitted successfully', report: newReport };
};

export const getUserReports = (userId) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  return reports.filter(report => report.userId === userId);
};

export const getAllReports = () => {
  return JSON.parse(localStorage.getItem('reports') || '[]');
};

export const getReportById = (reportId) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  return reports.find(report => report.id === reportId);
};

export const updateReportStatus = (reportId, status, reward = null, feedback = null) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const reportIndex = reports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return { success: false, message: 'Report not found' };
  }
  
  reports[reportIndex].status = status;
  if (reward !== null) reports[reportIndex].reward = reward;
  if (feedback !== null) reports[reportIndex].feedback = feedback;
  reports[reportIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update user earnings if reward is given
  if (reward && status === 'Accepted') {
    const report = reports[reportIndex];
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === report.userId);
    
    if (userIndex !== -1) {
      users[userIndex].totalEarnings = (users[userIndex].totalEarnings || 0) + reward;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
  
  return { success: true, message: 'Report updated successfully', report: reports[reportIndex] };
};

export const deleteReport = (reportId) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const filteredReports = reports.filter(r => r.id !== reportId);
  localStorage.setItem('reports', JSON.stringify(filteredReports));
  
  return { success: true, message: 'Report deleted successfully' };
};

export const getReportStats = (userId) => {
  const reports = getUserReports(userId);
  
  return {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending Review').length,
    accepted: reports.filter(r => r.status === 'Accepted').length,
    rejected: reports.filter(r => r.status === 'Rejected').length,
    inReview: reports.filter(r => r.status === 'In Review').length,
  };
};

