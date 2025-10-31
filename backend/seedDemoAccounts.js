import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const demoAccounts = [
  // Demo Researcher Account
  {
    username: 'demo_researcher',
    email: 'demo@researcher.com',
    password: 'demo123',
    fullName: 'Alex Hunter',
    role: 'user',
    bio: 'Experienced security researcher specializing in web applications',
    skills: ['XSS', 'SQL Injection', 'CSRF', 'Authentication Bypass'],
    reportsSubmitted: 12,
    totalEarnings: 15750,
    rank: 'Expert'
  },
  
  // Demo Company Account
  {
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
    isVerified: true
  },
  
  // Demo Triage Account
  {
    username: 'demo_triage',
    email: 'demo@triage.com',
    password: 'demo123',
    fullName: 'Michael Chen',
    role: 'triage',
    department: 'Security Review Team',
    reportsReviewed: 89,
    averageReviewTime: 1.8,
    specializations: ['Web Security', 'Mobile Security', 'API Security']
  }
];

async function seedDemoAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    // Check if demo accounts already exist
    for (const account of demoAccounts) {
      const existingUser = await User.findOne({ email: account.email });
      
      if (existingUser) {
        console.log(`⚠️  Demo account already exists: ${account.email}`);
        continue;
      }
      
      // Create new demo user
      const user = new User(account);
      await user.save();
      console.log(`✅ Created demo account: ${account.email} (${account.role})`);
    }
    
    console.log('\n🎉 Demo account seeding completed!');
    console.log('\n📋 Demo Credentials:');
    console.log('🔍 Researcher: demo@researcher.com / demo123');
    console.log('🏢 Company: demo@company.com / demo123');
    console.log('⚖️  Triage: demo@triage.com / demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo accounts:', error);
    process.exit(1);
  }
}

seedDemoAccounts();
