// Program management utilities with MongoDB integration
import { programsAPI } from './api';

export const createProgram = async (programData) => {
  try {
    const result = await programsAPI.create(programData);
    
    // Update company stats locally for immediate feedback
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && result.success) {
      currentUser.programsCreated = (currentUser.programsCreated || 0) + 1;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return result;
  } catch (error) {
    return { success: false, message: 'Failed to create program' };
  }
};

export const getUserPrograms = async (userId) => {
  try {
    const programs = await programsAPI.getMyPrograms();
    return Array.isArray(programs) ? programs : [];
  } catch (error) {
    console.error('Error getting user programs:', error);
    return [];
  }
};

export const getAllPrograms = async () => {
  try {
    const programs = await programsAPI.getAll();
    return Array.isArray(programs) ? programs : [];
  } catch (error) {
    console.error('Error getting all programs:', error);
    return [];
  }
};

export const getProgramById = async (programId) => {
  try {
    return await programsAPI.getById(programId);
  } catch (error) {
    console.error('Error getting program:', error);
    return null;
  }
};

export const updateProgram = async (programId, updatedData) => {
  try {
    return await programsAPI.update(programId, updatedData);
  } catch (error) {
    return { success: false, message: 'Failed to update program' };
  }
};

export const deleteProgram = async (programId) => {
  try {
    return await programsAPI.delete(programId);
  } catch (error) {
    return { success: false, message: 'Failed to delete program' };
  }
};

export const getProgramStats = async (programId) => {
  try {
    // This would come from the backend aggregation
    const reports = await reportsAPI.getByProgram(programId);
    
    return {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'Pending Review').length,
      acceptedReports: reports.filter(r => r.status === 'Accepted').length,
      rejectedReports: reports.filter(r => r.status === 'Rejected').length,
      totalBountyPaid: reports
        .filter(r => r.status === 'Accepted' && r.reward)
        .reduce((sum, r) => sum + r.reward, 0)
    };
  } catch (error) {
    return {
      totalReports: 0,
      pendingReports: 0,
      acceptedReports: 0,
      rejectedReports: 0,
      totalBountyPaid: 0
    };
  }
};