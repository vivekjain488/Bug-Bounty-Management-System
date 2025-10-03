// Report management utilities using MockAPI
import { reportsAPI, usersAPI } from './api';

export const submitReport = async (reportData) => {
  try {
    const newReport = {
      ...reportData,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review',
      reward: null,
      feedback: null,
    };
    
    const response = await reportsAPI.create(newReport);
    
    // Update user stats
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      try {
        const userResponse = await usersAPI.getById(currentUser.id);
        const user = userResponse.data;
        
        const updatedUser = {
          ...user,
          reportsSubmitted: (user.reportsSubmitted || 0) + 1
        };
        
        await usersAPI.update(currentUser.id, updatedUser);
        
        // Update session
        const sessionUser = { ...updatedUser };
        delete sessionUser.password;
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      } catch (error) {
        console.error('Error updating user stats:', error);
      }
    }
    
    return { success: true, message: 'Report submitted successfully', report: response.data };
  } catch (error) {
    console.error('Submit report error:', error);
    return { success: false, message: 'Failed to submit report. Please try again.' };
  }
};

export const getUserReports = async (userId) => {
  try {
    const reports = await reportsAPI.getByUserId(userId);
    return reports;
  } catch (error) {
    console.error('Get user reports error:', error);
    return [];
  }
};

export const getAllReports = async () => {
  try {
    const response = await reportsAPI.getAll();
    return response.data;
  } catch (error) {
    console.error('Get all reports error:', error);
    return [];
  }
};

export const getReportById = async (reportId) => {
  try {
    const response = await reportsAPI.getById(reportId);
    return response.data;
  } catch (error) {
    console.error('Get report by ID error:', error);
    return null;
  }
};

export const updateReportStatus = async (reportId, status, reward = null, feedback = null) => {
  try {
    const reportResponse = await reportsAPI.getById(reportId);
    const report = reportResponse.data;
    
    const updatedReport = {
      ...report,
      status,
      reward: reward !== null ? reward : report.reward,
      feedback: feedback !== null ? feedback : report.feedback,
      updatedAt: new Date().toISOString(),
    };
    
    const response = await reportsAPI.update(reportId, updatedReport);
    
    // Update user earnings if reward is given
    if (reward && status === 'Accepted') {
      try {
        const userResponse = await usersAPI.getById(report.userId);
        const user = userResponse.data;
        
        const updatedUser = {
          ...user,
          totalEarnings: (user.totalEarnings || 0) + reward
        };
        
        await usersAPI.update(report.userId, updatedUser);
        
        // Update session if it's the current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id === report.userId) {
          const sessionUser = { ...updatedUser };
          delete sessionUser.password;
          localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        }
      } catch (error) {
        console.error('Error updating user earnings:', error);
      }
    }
    
    return { success: true, message: 'Report updated successfully', report: response.data };
  } catch (error) {
    console.error('Update report status error:', error);
    return { success: false, message: 'Failed to update report' };
  }
};

export const deleteReport = async (reportId) => {
  try {
    await reportsAPI.delete(reportId);
    return { success: true, message: 'Report deleted successfully' };
  } catch (error) {
    console.error('Delete report error:', error);
    return { success: false, message: 'Failed to delete report' };
  }
};

export const clearUserReports = async (userId) => {
  try {
    const reports = await getUserReports(userId);
    
    // Delete all user reports
    await Promise.all(reports.map(report => reportsAPI.delete(report.id)));
    
    // Update user stats
    try {
      const userResponse = await usersAPI.getById(userId);
      const user = userResponse.data;
      
      const updatedUser = {
        ...user,
        reportsSubmitted: 0,
        totalEarnings: 0
      };
      
      await usersAPI.update(userId, updatedUser);
      
      // Update session
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.id === userId) {
        const sessionUser = { ...updatedUser };
        delete sessionUser.password;
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
    
    return { success: true, message: 'All reports cleared successfully' };
  } catch (error) {
    console.error('Clear user reports error:', error);
    return { success: false, message: 'Failed to clear reports' };
  }
};

export const getReportStats = async (userId) => {
  try {
    const reports = await getUserReports(userId);
    
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'Pending Review').length,
      accepted: reports.filter(r => r.status === 'Accepted').length,
      rejected: reports.filter(r => r.status === 'Rejected').length,
      inReview: reports.filter(r => r.status === 'In Review').length,
    };
  } catch (error) {
    console.error('Get report stats error:', error);
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      inReview: 0,
    };
  }
};
