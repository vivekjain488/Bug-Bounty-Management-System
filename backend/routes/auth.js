import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullName, role = 'user', ...additionalData } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create user based on role
    let userData = {
      username,
      email,
      password,
      fullName,
      role
    };
    
    // Add role-specific fields
    if (role === 'user') {
      userData = {
        ...userData,
        bio: additionalData.bio || '',
        skills: additionalData.skills || [],
        reportsSubmitted: 0,
        totalEarnings: 0,
        rank: 'Beginner'
      };
    } else if (role === 'company') {
      userData = {
        ...userData,
        companyName: additionalData.companyName || '',
        industry: additionalData.industry || '',
        website: additionalData.website || '',
        programsCreated: 0,
        totalBountyPaid: 0,
        isVerified: false
      };
    } else if (role === 'triage') {
      userData = {
        ...userData,
        department: additionalData.department || 'Security',
        reportsReviewed: 0,
        averageReviewTime: 0,
        specializations: additionalData.specializations || []
      };
    }
    
    const user = new User(userData);
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo credentials hardcoded validation
    const demoCredentials = {
      'demo@researcher.com': { password: 'demo123', role: 'user' },
      'demo@company.com': { password: 'demo123', role: 'company' },
      'demo@triage.com': { password: 'demo123', role: 'triage' }
    };
    
    // Check if it's a demo account
    if (demoCredentials[email] && password === demoCredentials[email].password) {
      // Try to find existing demo user in database
      let user = await User.findOne({ email });
      
      // If demo user doesn't exist in database, create it
      if (!user) {
        const demoUserData = {
          researcher: {
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
          company: {
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
          triage: {
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
        };
        
        const accountType = email.includes('researcher') ? 'researcher' : 
                           email.includes('company') ? 'company' : 'triage';
        
        user = new User(demoUserData[accountType]);
        await user.save();
        console.log(`✅ Demo ${accountType} account created in database`);
      }
      
      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      return res.json({
        success: true,
        message: 'Login successful (Demo Account)',
        token,
        user
      });
    }
    
    // Regular login for non-demo accounts
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update here
    delete updates._id;
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete account
router.delete('/me', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

