// Mock data for companies and bug bounty programs

export const companies = [
  {
    id: 1,
    name: 'TechCorp',
    logo: '🚀',
    industry: 'Technology',
    tags: ['Web', 'Mobile', 'API'],
    severity: 'Critical',
    minBounty: 100,
    maxBounty: 15000,
    description: 'Leading cloud infrastructure provider. Find vulnerabilities in our web platform, mobile apps, and API services.',
    about: 'TechCorp is a global leader in cloud computing and enterprise solutions. We serve over 10 million customers worldwide and process billions of transactions daily. Security is at the core of everything we do.',
    scope: [
      '*.techcorp.com',
      'api.techcorp.com',
      'mobile apps (iOS & Android)',
      'Desktop applications'
    ],
    outOfScope: [
      'Third-party integrations',
      'Social engineering attacks',
      'DDoS attacks'
    ],
    rules: [
      'Do not access or modify user data without permission',
      'Report findings within 24 hours of discovery',
      'Do not publicly disclose vulnerabilities before they are fixed',
      'Only test on designated testing environments when possible'
    ],
    rewardStructure: {
      Critical: '$5,000 - $15,000',
      High: '$2,000 - $5,000',
      Medium: '$500 - $2,000',
      Low: '$100 - $500'
    }
  },
  {
    id: 2,
    name: 'FinanceHub',
    logo: '💰',
    industry: 'Fintech',
    tags: ['Banking', 'Payment', 'Security'],
    severity: 'Critical',
    minBounty: 500,
    maxBounty: 50000,
    description: 'Digital banking platform. We\'re looking for security researchers to help secure our payment systems.',
    about: 'FinanceHub revolutionizes digital banking with cutting-edge technology. We handle millions in transactions every day and take security extremely seriously. Our bug bounty program is one of the most rewarding in the industry.',
    scope: [
      'www.financehub.com',
      'app.financehub.com',
      'api.financehub.com',
      'Mobile banking apps',
      'Payment processing systems'
    ],
    outOfScope: [
      'Marketing websites',
      'Third-party payment gateways',
      'Physical security issues'
    ],
    rules: [
      'Never attempt to access real customer funds or data',
      'Use test accounts provided in the program',
      'No automated scanning without prior approval',
      'Comply with all banking regulations'
    ],
    rewardStructure: {
      Critical: '$10,000 - $50,000',
      High: '$5,000 - $10,000',
      Medium: '$1,000 - $5,000',
      Low: '$500 - $1,000'
    }
  },
  {
    id: 3,
    name: 'DataStream',
    logo: '📊',
    industry: 'Analytics',
    tags: ['Big Data', 'Cloud', 'Storage'],
    severity: 'High',
    minBounty: 200,
    maxBounty: 8000,
    description: 'Enterprise data analytics platform. Help us maintain the security of our data processing infrastructure.',
    about: 'DataStream provides enterprise-grade analytics solutions to Fortune 500 companies. Our platform processes petabytes of data daily, making security paramount.',
    scope: [
      '*.datastream.io',
      'Dashboard application',
      'Data processing APIs',
      'Client SDKs'
    ],
    outOfScope: [
      'Legacy systems (v1.x)',
      'Internal tools',
      'Test environments'
    ],
    rules: [
      'Do not access or exfiltrate customer data',
      'Report within 48 hours',
      'No social engineering',
      'Respect rate limits'
    ],
    rewardStructure: {
      Critical: '$4,000 - $8,000',
      High: '$2,000 - $4,000',
      Medium: '$500 - $2,000',
      Low: '$200 - $500'
    }
  },
  {
    id: 4,
    name: 'SecureChat',
    logo: '💬',
    industry: 'Communication',
    tags: ['Messaging', 'Encryption', 'Privacy'],
    severity: 'Critical',
    minBounty: 300,
    maxBounty: 20000,
    description: 'End-to-end encrypted messaging app. Looking for vulnerabilities in our encryption and messaging protocols.',
    about: 'SecureChat is the world\'s most secure messaging platform with over 500 million users. We use state-of-the-art end-to-end encryption and take user privacy seriously.',
    scope: [
      'Web application',
      'Desktop apps (Windows, Mac, Linux)',
      'Mobile apps (iOS, Android)',
      'Encryption protocols',
      'API endpoints'
    ],
    outOfScope: [
      'Spam/abuse reports',
      'User-generated content',
      'Metadata collection (by design)'
    ],
    rules: [
      'Do not intercept real user communications',
      'Do not attempt to break encryption at scale',
      'Use test accounts only',
      'Follow responsible disclosure'
    ],
    rewardStructure: {
      Critical: '$8,000 - $20,000',
      High: '$3,000 - $8,000',
      Medium: '$800 - $3,000',
      Low: '$300 - $800'
    }
  },
  {
    id: 5,
    name: 'ShopNow',
    logo: '🛒',
    industry: 'E-commerce',
    tags: ['Retail', 'Payment', 'Mobile'],
    severity: 'High',
    minBounty: 150,
    maxBounty: 10000,
    description: 'Global e-commerce marketplace. Help us secure customer data and transaction systems.',
    about: 'ShopNow is a leading e-commerce platform with millions of daily transactions. We connect buyers and sellers globally and prioritize security and trust.',
    scope: [
      'www.shopnow.com',
      'seller.shopnow.com',
      'checkout.shopnow.com',
      'Mobile apps',
      'Payment processing'
    ],
    outOfScope: [
      'Seller content/products',
      'Marketing emails',
      'Third-party logistics'
    ],
    rules: [
      'Do not make real purchases',
      'Use test mode for payment testing',
      'Do not access seller/buyer data',
      'Report ASAP for payment issues'
    ],
    rewardStructure: {
      Critical: '$5,000 - $10,000',
      High: '$2,000 - $5,000',
      Medium: '$500 - $2,000',
      Low: '$150 - $500'
    }
  },
  {
    id: 6,
    name: 'HealthVault',
    logo: '🏥',
    industry: 'Healthcare',
    tags: ['Medical', 'HIPAA', 'Records'],
    severity: 'Critical',
    minBounty: 1000,
    maxBounty: 25000,
    description: 'Digital health records platform. Security is our top priority for protecting patient data.',
    about: 'HealthVault securely stores and manages health records for millions of patients. We are HIPAA compliant and maintain the highest security standards.',
    scope: [
      'Patient portal',
      'Provider dashboard',
      'API endpoints',
      'Mobile health apps',
      'Electronic health records system'
    ],
    outOfScope: [
      'Physical security',
      'Social engineering against staff',
      'Third-party medical devices'
    ],
    rules: [
      'NEVER access real patient data',
      'Use only test accounts provided',
      'Understand HIPAA implications',
      'Immediate reporting required',
      'Maximum confidentiality expected'
    ],
    rewardStructure: {
      Critical: '$10,000 - $25,000',
      High: '$5,000 - $10,000',
      Medium: '$2,000 - $5,000',
      Low: '$1,000 - $2,000'
    }
  },
  {
    id: 7,
    name: 'EduLearn',
    logo: '📚',
    industry: 'Education',
    tags: ['E-learning', 'Video', 'Content'],
    severity: 'Medium',
    minBounty: 100,
    maxBounty: 5000,
    description: 'Online education platform serving millions of students worldwide.',
    about: 'EduLearn provides accessible education to learners globally. Our platform hosts thousands of courses and protects student data and academic records.',
    scope: [
      'www.edulearn.com',
      'Student dashboard',
      'Instructor portal',
      'Video streaming platform',
      'Mobile learning apps'
    ],
    outOfScope: [
      'Course content issues',
      'Instructor-uploaded content',
      'Student forum posts'
    ],
    rules: [
      'Do not disrupt learning activities',
      'Do not access student records',
      'Use test accounts',
      'Respect academic integrity'
    ],
    rewardStructure: {
      Critical: '$2,500 - $5,000',
      High: '$1,000 - $2,500',
      Medium: '$300 - $1,000',
      Low: '$100 - $300'
    }
  },
  {
    id: 8,
    name: 'GameZone',
    logo: '🎮',
    industry: 'Gaming',
    tags: ['Gaming', 'Multiplayer', 'Social'],
    severity: 'High',
    minBounty: 200,
    maxBounty: 12000,
    description: 'Multiplayer gaming platform. Help us protect player accounts and in-game economies.',
    about: 'GameZone is a premier gaming platform with millions of active players. We host competitive esports and casual gaming communities.',
    scope: [
      'Game client',
      'Web platform',
      'Account management',
      'In-game store',
      'Anti-cheat systems'
    ],
    outOfScope: [
      'Game bugs/glitches',
      'Player behavior',
      'Game balance issues'
    ],
    rules: [
      'Do not disrupt gameplay',
      'Do not steal in-game items',
      'Report exploits before disclosure',
      'No automated botting'
    ],
    rewardStructure: {
      Critical: '$6,000 - $12,000',
      High: '$2,500 - $6,000',
      Medium: '$500 - $2,500',
      Low: '$200 - $500'
    }
  },
  {
    id: 9,
    name: 'TravelNow',
    logo: '✈️',
    industry: 'Travel',
    tags: ['Booking', 'Payment', 'Mobile'],
    severity: 'High',
    minBounty: 150,
    maxBounty: 8000,
    description: 'Travel booking and reservation platform with millions of users.',
    about: 'TravelNow connects travelers with airlines, hotels, and experiences worldwide. We process millions of bookings annually.',
    scope: [
      'Booking platform',
      'Payment gateway',
      'Mobile apps',
      'Partner API',
      'Customer portal'
    ],
    outOfScope: [
      'Third-party hotels/airlines',
      'Review content',
      'Marketing campaigns'
    ],
    rules: [
      'Do not make real bookings',
      'Use test credit cards',
      'Do not access traveler PII',
      'Report booking/payment bugs immediately'
    ],
    rewardStructure: {
      Critical: '$4,000 - $8,000',
      High: '$1,500 - $4,000',
      Medium: '$400 - $1,500',
      Low: '$150 - $400'
    }
  },
  {
    id: 10,
    name: 'CloudStore',
    logo: '☁️',
    industry: 'Cloud Storage',
    tags: ['Storage', 'Sync', 'Enterprise'],
    severity: 'Critical',
    minBounty: 300,
    maxBounty: 18000,
    description: 'Enterprise cloud storage and file sharing platform.',
    about: 'CloudStore provides secure cloud storage for businesses and individuals. We protect billions of files and ensure data privacy.',
    scope: [
      'Web application',
      'Desktop sync clients',
      'Mobile apps',
      'API endpoints',
      'Sharing mechanisms'
    ],
    outOfScope: [
      'User-uploaded content',
      'Third-party integrations',
      'Client-side encryption (by design)'
    ],
    rules: [
      'Do not access user files',
      'Do not share findings publicly',
      'Use test accounts',
      'Report data leaks immediately'
    ],
    rewardStructure: {
      Critical: '$8,000 - $18,000',
      High: '$3,000 - $8,000',
      Medium: '$800 - $3,000',
      Low: '$300 - $800'
    }
  },
  {
    id: 11,
    name: 'SocialConnect',
    logo: '📱',
    industry: 'Social Media',
    tags: ['Social', 'Privacy', 'Mobile'],
    severity: 'Critical',
    minBounty: 500,
    maxBounty: 30000,
    description: 'Social networking platform with focus on privacy and security.',
    about: 'SocialConnect is a next-generation social network prioritizing user privacy and data security with over 200 million users.',
    scope: [
      'Web platform',
      'iOS app',
      'Android app',
      'API endpoints',
      'Privacy controls'
    ],
    outOfScope: [
      'User content moderation',
      'Spam accounts',
      'Fake profiles'
    ],
    rules: [
      'Do not scrape user data',
      'Do not create spam accounts',
      'Respect privacy settings',
      'Report immediately'
    ],
    rewardStructure: {
      Critical: '$15,000 - $30,000',
      High: '$5,000 - $15,000',
      Medium: '$1,500 - $5,000',
      Low: '$500 - $1,500'
    }
  },
  {
    id: 12,
    name: 'DevTools Pro',
    logo: '🛠️',
    industry: 'Developer Tools',
    tags: ['API', 'CLI', 'DevOps'],
    severity: 'High',
    minBounty: 250,
    maxBounty: 10000,
    description: 'Developer tools and CI/CD platform for modern software teams.',
    about: 'DevTools Pro provides comprehensive development tools, CI/CD pipelines, and collaboration features for development teams worldwide.',
    scope: [
      'Web dashboard',
      'CLI tools',
      'API platform',
      'Build systems',
      'Repository management'
    ],
    outOfScope: [
      'User repositories content',
      'Third-party plugins',
      'Open source projects hosted'
    ],
    rules: [
      'Do not access private repositories',
      'Do not disrupt CI/CD pipelines',
      'Use test projects only',
      'Follow responsible disclosure'
    ],
    rewardStructure: {
      Critical: '$5,000 - $10,000',
      High: '$2,000 - $5,000',
      Medium: '$600 - $2,000',
      Low: '$250 - $600'
    }
  }
];

export const getCompanyById = (id) => {
  return companies.find(company => company.id === parseInt(id));
};

export const getAllCompanies = () => {
  return companies;
};

