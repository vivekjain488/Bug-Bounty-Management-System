// Program management utilities using localStorage

export const createProgram = (programData) => {
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  
  // Calculate min and max bounties from reward structure
  const rewards = programData.rewardStructure;
  const allMins = Object.values(rewards).map(r => {
    const match = r.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const allMaxs = Object.values(rewards).map(r => {
    const match = r.match(/\$\d+ - \$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });

  const newProgram = {
    id: Date.now(),
    ...programData,
    minBounty: Math.min(...allMins),
    maxBounty: Math.max(...allMaxs),
    severity: 'Critical', // Default to highest
    createdAt: new Date().toISOString(),
    isActive: true,
    totalReports: 0,
    acceptedReports: 0,
    totalBountyPaid: 0
  };
  
  programs.push(newProgram);
  localStorage.setItem('programs', JSON.stringify(programs));
  
  // Update company stats
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === programData.companyId);
  if (userIndex !== -1) {
    users[userIndex].programsCreated = (users[userIndex].programsCreated || 0) + 1;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current session
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === programData.companyId) {
      currentUser.programsCreated = users[userIndex].programsCreated;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }
  
  return { success: true, message: 'Program created successfully', program: newProgram };
};

export const getUserPrograms = (userId) => {
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  return programs.filter(program => program.companyId === userId);
};

export const getAllPrograms = () => {
  return JSON.parse(localStorage.getItem('programs') || '[]');
};

export const getProgramById = (programId) => {
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  return programs.find(program => program.id === parseInt(programId));
};

export const updateProgram = (programId, updatedData) => {
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  const programIndex = programs.findIndex(p => p.id === parseInt(programId));
  
  if (programIndex === -1) {
    return { success: false, message: 'Program not found' };
  }
  
  programs[programIndex] = { ...programs[programIndex], ...updatedData };
  localStorage.setItem('programs', JSON.stringify(programs));
  
  return { success: true, message: 'Program updated successfully', program: programs[programIndex] };
};

export const deleteProgram = (programId) => {
  const programs = JSON.parse(localStorage.getItem('programs') || '[]');
  const filteredPrograms = programs.filter(p => p.id !== parseInt(programId));
  localStorage.setItem('programs', JSON.stringify(filteredPrograms));
  
  return { success: true, message: 'Program deleted successfully' };
};

export const getProgramStats = (programId) => {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const programReports = reports.filter(r => r.companyId === parseInt(programId));
  
  return {
    totalReports: programReports.length,
    pendingReports: programReports.filter(r => r.status === 'Pending Review').length,
    acceptedReports: programReports.filter(r => r.status === 'Accepted').length,
    rejectedReports: programReports.filter(r => r.status === 'Rejected').length,
    totalBountyPaid: programReports
      .filter(r => r.status === 'Accepted' && r.reward)
      .reduce((sum, r) => sum + r.reward, 0)
  };
};
