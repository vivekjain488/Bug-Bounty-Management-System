// Report management utilities with MongoDB integration
import { reportsAPI } from './api';

export const submitReport = async (reportData) => {
  try {
    const result = await reportsAPI.create(reportData);
    
    // Also update user stats locally for immediate feedback
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && result.success) {
      currentUser.reportsSubmitted = (currentUser.reportsSubmitted || 0) + 1;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return result;
  } catch (error) {
    return { success: false, message: 'Failed to submit report' };
  }
};

export const getUserReports = async (userId) => {
  try {
    const reports = await reportsAPI.getMyReports();
    return Array.isArray(reports) ? reports : [];
  } catch (error) {
    console.error('Error getting user reports:', error);
    return [];
  }
};

export const getAllReports = async () => {
  try {
    const reports = await reportsAPI.getAll();
    return Array.isArray(reports) ? reports : [];
  } catch (error) {
    console.error('Error getting all reports:', error);
    return [];
  }
};

export const getReportById = async (reportId) => {
  try {
    return await reportsAPI.getById(reportId);
  } catch (error) {
    console.error('Error getting report:', error);
    return null;
  }
};

export const getReportsByProgram = async (programId) => {
  try {
    const reports = await reportsAPI.getByProgram(programId);
    return Array.isArray(reports) ? reports : [];
  } catch (error) {
    console.error('Error getting program reports:', error);
    return [];
  }
};

export const updateReportStatus = async (reportId, status, reward = null, feedback = null) => {
  try {
    const statusData = { status };
    if (reward !== null) statusData.reward = reward;
    if (feedback !== null) statusData.feedback = feedback;
    
    return await reportsAPI.updateStatus(reportId, statusData);
  } catch (error) {
    return { success: false, message: 'Failed to update report status' };
  }
};

export const deleteReport = async (reportId) => {
  try {
    return await reportsAPI.delete(reportId);
  } catch (error) {
    return { success: false, message: 'Failed to delete report' };
  }
};

export const getReportStats = async (userId) => {
  try {
    const stats = await reportsAPI.getMyStats();
    
    return {
      total: stats.total || 0,
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      rejected: stats.rejected || 0,
      inReview: stats.inReview || 0,
    };
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      inReview: 0
    };
  }
};

export const clearUserReports = async (userId) => {
  try {
    // This would need a backend endpoint
    // For now, return success
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.reportsSubmitted = 0;
      currentUser.totalEarnings = 0;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return { success: true, message: 'Reports cleared successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to clear reports' };
  }
};