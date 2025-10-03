// Demo accounts for testing the multi-role system

export const createDemoAccounts = () => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if demo accounts already exist
  const demoAccountExists = existingUsers.some(user => 
    user.email === 'demo@researcher.com' || 
    user.email === 'demo@company.com' || 
    user.email === 'demo@triage.com'
  );
  
  if (demoAccountExists) {
    return; // Demo accounts already created
  }

  const demoAccounts = [
    // Demo Researcher Account
    {
      id: 'demo_user_001',
      username: 'demo_researcher',
      email: 'demo@researcher.com',
      password: 'demo123',
      fullName: 'Alex Hunter',
      role: 'user',
      bio: 'Experienced security researcher specializing in web applications',
      skills: ['XSS', 'SQL Injection', 'CSRF', 'Authentication Bypass'],
      reportsSubmitted: 12,
      totalEarnings: 15750,
      rank: 'Expert',
      joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
    },
    
    // Demo Company Account
    {
      id: 'demo_company_001',
      username: 'demo_company',
      email: 'demo@company.com',
      password: 'demo123',
      fullName: 'Sarah Johnson',
      role: 'company',
      companyName: 'DemoTech Solutions',
      industry: 'Technology',
      website: 'https://www.demotech.com',
      programsCreated: 2,
      totalBountyPaid: 25000,
      isVerified: true,
      joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
    },
    
    // Demo Triage Account
    {
      id: 'demo_triage_001',
      username: 'demo_triage',
      email: 'demo@triage.com',
      password: 'demo123',
      fullName: 'Michael Chen',
      role: 'triage',
      department: 'Security Review Team',
      reportsReviewed: 89,
      averageReviewTime: 1.8,
      specializations: ['Web Security', 'Mobile Security', 'API Security'],
      joinedDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(), // 2 years ago
    }
  ];

  // Add demo accounts to existing users
  const allUsers = [...existingUsers, ...demoAccounts];
  localStorage.setItem('users', JSON.stringify(allUsers));
  
  console.log('Demo accounts created:');
  console.log('🔍 Researcher: demo@researcher.com / demo123');
  console.log('🏢 Company: demo@company.com / demo123');
  console.log('⚖️ Triage: demo@triage.com / demo123');
};

export const getDemoCredentials = () => {
  return {
    researcher: {
      email: 'demo@researcher.com',
      password: 'demo123',
      type: 'user'
    },
    company: {
      email: 'demo@company.com', 
      password: 'demo123',
      type: 'company'
    },
    triage: {
      email: 'demo@triage.com',
      password: 'demo123', 
      type: 'triage'
    }
  };
};
