import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from './models/Report.js';
import User from './models/User.js';

dotenv.config();

const demoReports = [
  // Critical - Pending Review
  {
    title: 'SQL Injection in Login Form',
    vulnerabilityType: 'SQL Injection',
    category: 'Web Application',
    severity: 'Critical',
    programId: '1',
    description: 'Found SQL injection vulnerability in the login form that allows attackers to bypass authentication. By entering \' OR \'1\'=\'1 in the username field, I was able to access admin accounts without knowing the password.',
    stepsToReproduce: '1. Navigate to login page\n2. Enter \' OR \'1\'=\'1 in username\n3. Enter any password\n4. Click login\n5. Successfully logged in as admin',
    impact: 'Complete compromise of user authentication system. Attackers can access any user account including administrative accounts.',
    proofOfConcept: 'Screenshot and video demonstration attached showing successful admin access without valid credentials.',
    status: 'Pending Review',
    companyId: 1
  },
  
  // High - Pending Review
  {
    title: 'XSS Vulnerability in Comment Section',
    vulnerabilityType: 'Cross-Site Scripting (XSS)',
    category: 'Web Application',
    severity: 'High',
    programId: '2',
    description: 'Stored XSS vulnerability found in the comment section. User input is not properly sanitized, allowing injection of malicious JavaScript code.',
    stepsToReproduce: '1. Go to any post with comments\n2. Submit comment with <script>alert(document.cookie)</script>\n3. Refresh page\n4. Script executes for all users viewing the page',
    impact: 'Attackers can steal session cookies, redirect users to malicious sites, or perform actions on behalf of victims.',
    proofOfConcept: 'Proof of concept video showing cookie theft using injected JavaScript.',
    status: 'Pending Review',
    companyId: 2
  },
  
  // Medium - In Review
  {
    title: 'CSRF Token Bypass in Profile Update',
    vulnerabilityType: 'CSRF',
    category: 'Web Application',
    severity: 'Medium',
    programId: '1',
    description: 'The profile update endpoint does not properly validate CSRF tokens, allowing attackers to perform actions on behalf of authenticated users.',
    stepsToReproduce: '1. Create malicious HTML page with form auto-submit\n2. Send link to victim\n3. When victim clicks, their profile is updated without consent',
    impact: 'Attackers can modify user profiles, change email addresses, or update sensitive information without user knowledge.',
    proofOfConcept: 'HTML proof of concept that successfully updates victim profile.',
    status: 'In Review',
    companyId: 1
  },
  
  // High - In Review
  {
    title: 'Authentication Bypass via JWT Manipulation',
    vulnerabilityType: 'Authentication Bypass',
    category: 'API Security',
    severity: 'High',
    programId: '3',
    description: 'JWT tokens are not properly validated server-side. By modifying the user role in the JWT payload, I was able to escalate privileges to admin.',
    stepsToReproduce: '1. Login as regular user\n2. Decode JWT token\n3. Change role to "admin"\n4. Re-encode token\n5. Access admin endpoints successfully',
    impact: 'Any authenticated user can escalate privileges to administrator level, gaining full control of the application.',
    proofOfConcept: 'Script demonstrating JWT manipulation and successful admin access.',
    status: 'In Review',
    companyId: 3
  },
  
  // Low - Pending Review
  {
    title: 'Information Disclosure in Error Messages',
    vulnerabilityType: 'Information Disclosure',
    category: 'Web Application',
    severity: 'Low',
    programId: '4',
    description: 'Detailed error messages are displayed to users, revealing sensitive information about the application structure and database.',
    stepsToReproduce: '1. Submit invalid data to various forms\n2. Observe error messages\n3. Error messages reveal database table names, column names, and file paths',
    impact: 'Attackers can gather information about the application structure to plan more sophisticated attacks.',
    proofOfConcept: 'Screenshots of various error messages showing internal details.',
    status: 'Pending Review',
    companyId: 4
  },
  
  // Critical - Accepted
  {
    title: 'Remote Code Execution via File Upload',
    vulnerabilityType: 'Remote Code Execution',
    category: 'Web Application',
    severity: 'Critical',
    programId: '2',
    description: 'File upload functionality does not properly validate file types. Successfully uploaded PHP web shell and executed arbitrary commands on server.',
    stepsToReproduce: '1. Go to file upload page\n2. Upload PHP file with .jpg extension\n3. Access uploaded file directly\n4. Execute system commands',
    impact: 'Complete server compromise. Attackers can execute arbitrary code, access databases, steal data, or pivot to internal networks.',
    proofOfConcept: 'Full exploitation chain demonstrating command execution on production server.',
    status: 'Accepted',
    reward: 15000,
    companyId: 2,
    feedback: 'Excellent find! This is a critical vulnerability that could have led to complete server compromise. Patch deployed and bounty awarded.'
  },
  
  // Medium - Accepted
  {
    title: 'Insecure Direct Object Reference in API',
    vulnerabilityType: 'IDOR',
    category: 'API Security',
    severity: 'Medium',
    programId: '1',
    description: 'API endpoints use predictable sequential IDs without proper authorization checks. Can access and modify other users\' data.',
    stepsToReproduce: '1. Login as user\n2. Call GET /api/profile/123\n3. Increment ID to 124, 125, etc.\n4. Access other users\' profiles without authorization',
    impact: 'Unauthorized access to sensitive user information including personal details, email addresses, and activity history.',
    proofOfConcept: 'API requests demonstrating unauthorized access to multiple user accounts.',
    status: 'Accepted',
    reward: 1500,
    companyId: 1,
    feedback: 'Valid vulnerability. Authorization checks have been added to all API endpoints. Thank you!'
  },
  
  // High - Rejected
  {
    title: 'Clickjacking on Login Page',
    vulnerabilityType: 'Clickjacking',
    category: 'Web Application',
    severity: 'High',
    programId: '3',
    description: 'Login page can be embedded in iframe, allowing clickjacking attacks.',
    stepsToReproduce: '1. Create HTML page with transparent iframe\n2. Overlay fake UI elements\n3. Trick users into entering credentials',
    impact: 'Attackers can steal user credentials through social engineering.',
    proofOfConcept: 'Demo page showing iframe embedding.',
    status: 'Rejected',
    feedback: 'Thank you for the report. However, X-Frame-Options headers are already set on our login page. Please verify your findings.',
    companyId: 3
  },
  
  // Medium - Pending Review
  {
    title: 'Missing Rate Limiting on Password Reset',
    vulnerabilityType: 'Rate Limiting',
    category: 'Authentication',
    severity: 'Medium',
    programId: '5',
    description: 'Password reset endpoint has no rate limiting, allowing brute force attacks on password reset tokens.',
    stepsToReproduce: '1. Request password reset\n2. Attempt to brute force 6-digit reset code\n3. No rate limiting enforced',
    impact: 'Attackers can brute force password reset tokens to gain unauthorized account access.',
    proofOfConcept: 'Script showing successful brute force of reset token in under 2 hours.',
    status: 'Pending Review',
    companyId: 5
  },
  
  // Low - In Review
  {
    title: 'Missing HttpOnly Flag on Session Cookies',
    vulnerabilityType: 'Cookie Security',
    category: 'Web Application',
    severity: 'Low',
    programId: '4',
    description: 'Session cookies are accessible via JavaScript due to missing HttpOnly flag, making them vulnerable to XSS attacks.',
    stepsToReproduce: '1. Login to application\n2. Open browser console\n3. Run document.cookie\n4. Session cookie is visible and accessible',
    impact: 'If XSS vulnerability is found, attackers can steal session cookies and hijack user sessions.',
    proofOfConcept: 'Screenshot showing session cookie accessible via JavaScript.',
    status: 'In Review',
    companyId: 4
  }
];

async function seedDemoReports() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    // Find the demo researcher account
    const researcher = await User.findOne({ email: 'demo@researcher.com' });
    
    if (!researcher) {
      console.error('❌ Demo researcher account not found. Please run seedDemoAccounts.js first.');
      process.exit(1);
    }
    
    console.log('✅ Found demo researcher:', researcher.email);
    
    // Check if demo reports already exist
    const existingReports = await Report.find({ userId: researcher._id });
    
    if (existingReports.length > 0) {
      console.log(`⚠️  ${existingReports.length} reports already exist for demo researcher`);
      const answer = 'yes'; // Auto-yes for automation
      
      if (answer === 'yes') {
        await Report.deleteMany({ userId: researcher._id });
        console.log('🗑️  Deleted existing demo reports');
      } else {
        console.log('Keeping existing reports');
        process.exit(0);
      }
    }
    
    // Create demo reports
    const reportsToCreate = demoReports.map(report => ({
      ...report,
      userId: researcher._id,
      username: researcher.username,
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last 7 days
      updatedAt: report.status !== 'Pending Review' ? new Date() : undefined
    }));
    
    const createdReports = await Report.insertMany(reportsToCreate);
    
    console.log(`\n✅ Created ${createdReports.length} demo reports!`);
    console.log('\n📊 Report Breakdown:');
    console.log(`   🔴 Critical: ${createdReports.filter(r => r.severity === 'Critical').length}`);
    console.log(`   🟠 High: ${createdReports.filter(r => r.severity === 'High').length}`);
    console.log(`   🟡 Medium: ${createdReports.filter(r => r.severity === 'Medium').length}`);
    console.log(`   🟢 Low: ${createdReports.filter(r => r.severity === 'Low').length}`);
    console.log('\n📋 Status Breakdown:');
    console.log(`   ⏳ Pending Review: ${createdReports.filter(r => r.status === 'Pending Review').length}`);
    console.log(`   🔍 In Review: ${createdReports.filter(r => r.status === 'In Review').length}`);
    console.log(`   ✅ Accepted: ${createdReports.filter(r => r.status === 'Accepted').length}`);
    console.log(`   ❌ Rejected: ${createdReports.filter(r => r.status === 'Rejected').length}`);
    
    console.log('\n🎉 Demo reports seeding completed!');
    console.log('\n💡 You can now login as triage (demo@triage.com / demo123) to review these reports!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo reports:', error);
    process.exit(1);
  }
}

seedDemoReports();
