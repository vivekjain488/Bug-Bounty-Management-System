// Program management utilities using API
import { programsAPI } from './api.js';

export const createProgram = async (programData) => {
  try {
    return await programsAPI.create(programData);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create program' };
  }
};

export const getUserPrograms = async () => {
  try {
    const result = await programsAPI.getMyPrograms();
    return result.success ? result.programs : [];
  } catch (error) {
    return [];
  }
};

export const getAllPrograms = async () => {
  try {
    const result = await programsAPI.getAll();
    return result.success ? result.programs : [];
  } catch (error) {
    return [];
  }
};

export const getProgramById = async (programId) => {
  try {
    const result = await programsAPI.getById(programId);
    return result.success ? result.program : null;
  } catch (error) {
    return null;
  }
};

export const updateProgram = async (programId, updatedData) => {
  try {
    return await programsAPI.update(programId, updatedData);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to update program' };
  }
};

export const deleteProgram = async (programId) => {
  try {
    return await programsAPI.delete(programId);
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to delete program' };
  }
};

export const getProgramStats = async (programId) => {
  // This would need to be calculated from the backend or passed with program data
  // For now, return a default structure
  return {
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0,
    totalBountyPaid: 0
  };
};
