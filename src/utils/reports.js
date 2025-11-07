// Report management utilities using API
import { reportsAPI } from './api.js';

export const submitReport = async (reportData) => {
  try {
    return await reportsAPI.submit(reportData);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to submit report' };
  }
};

export const getUserReports = async () => {
  try {
    const result = await reportsAPI.getAll();
    return result.success ? result.reports : [];
  } catch (error) {
    return [];
  }
};

export const getAllReports = async () => {
  try {
    const result = await reportsAPI.getAll();
    return result.success ? result.reports : [];
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    return [];
  }
};

export const getReportById = async (reportId) => {
  try {
    const result = await reportsAPI.getById(reportId);
    return result.success ? result.report : null;
  } catch (error) {
    return null;
  }
};

export const updateReportStatus = async (reportId, status, reward = null, feedback = null) => {
  try {
    return await reportsAPI.updateStatus(reportId, status, reward, feedback);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update report' };
  }
};

export const deleteReport = async (reportId) => {
  try {
    return await reportsAPI.delete(reportId);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete report' };
  }
};

export const getReportStats = async () => {
  try {
    const result = await reportsAPI.getStats();
    return result.success ? result.stats : {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      inReview: 0,
    };
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      inReview: 0,
    };
  }
};

export const clearUserReports = async () => {
  try {
    const reports = await getUserReports();
    const deletePromises = reports.map(report => deleteReport(report._id));
    await Promise.all(deletePromises);
    return { success: true, message: 'All reports cleared successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to clear reports' };
  }
};

