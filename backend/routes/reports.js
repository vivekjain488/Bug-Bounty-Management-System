import express from 'express';
import Report from '../models/Report.js';
import User from '../models/User.js';
import Program from '../models/Program.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all reports (role-aware)
router.get('/', authenticate, async (req, res) => {
  try {
    const { role } = req.user;
    
    let reports;
    if (role === 'triage') {
      // Triage can see all reports
      reports = await Report.find().populate('userId', 'username fullName').populate('reviewedBy', 'username fullName');
    } else if (role === 'company') {
      // Company can see reports for their programs
      reports = await Report.find({ companyId: req.user._id.toString() })
        .populate('userId', 'username fullName')
        .populate('reviewedBy', 'username fullName');
    } else {
      // Regular users can only see their own reports
      reports = await Report.find({ userId: req.user._id }).populate('reviewedBy', 'username fullName');
    }
    
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user's reports
router.get('/my', authenticate, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .populate('reviewedBy', 'username fullName');

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get program-specific reports
router.get('/program/:programId', authenticate, async (req, res) => {
  try {
    const { role } = req.user;
    const { programId } = req.params;

    let query = { programId };

    if (role === 'company') {
      query.companyId = req.user._id.toString();
    } else if (role === 'user') {
      query.userId = req.user._id;
    }

    const reports = await Report.find(query)
      .populate('userId', 'username fullName')
      .populate('reviewedBy', 'username fullName');

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get report stats (current user)
router.get('/stats/my', authenticate, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id });

    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.status === 'Pending Review').length,
      inReview: reports.filter(r => r.status === 'In Review').length,
      accepted: reports.filter(r => r.status === 'Accepted').length,
      rejected: reports.filter(r => r.status === 'Rejected').length,
      totalEarnings: reports
        .filter(r => r.status === 'Accepted' && r.reward)
        .reduce((sum, r) => sum + (r.reward || 0), 0)
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single report
router.get('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'username fullName email')
      .populate('reviewedBy', 'username fullName');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    // Check access
    if (req.user.role === 'user' && report.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit report
router.post('/', authenticate, async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({ success: false, message: 'Program ID is required' });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const reportData = {
      ...req.body,
      userId: req.user._id,
      companyId: program.companyId.toString(),
      programId: program._id.toString(),
      submittedAt: new Date()
    };
    
    const report = new Report(reportData);
    await report.save();
    
    // Update user stats
    const user = await User.findById(req.user._id);
    if (user && user.role === 'user') {
      user.reportsSubmitted += 1;
      await user.save();
    }
    
    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Triage review endpoint (NO AUTH for demo)
router.patch('/:id/review', async (req, res) => {
  try {
    const { status, reward, feedback } = req.body;
    
    console.log('📝 Triage Review Request:', { id: req.params.id, status, reward, feedback });
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    const oldStatus = report.status;
    report.status = status;
    if (reward !== undefined) report.reward = Number(reward);
    if (feedback) report.feedback = feedback;
    report.updatedAt = new Date();
    
    await report.save();
    
    // Update user earnings if accepted with reward
    if (status === 'Accepted' && reward && oldStatus !== 'Accepted') {
      const user = await User.findById(report.userId);
      if (user) {
        user.totalEarnings = (user.totalEarnings || 0) + Number(reward);
        await user.save();
        console.log('💰 User earnings updated:', user.username, '+$' + reward);
      }
    }
    
    console.log('✅ Report reviewed successfully');
    res.json({ success: true, message: 'Report updated successfully', report });
  } catch (error) {
    console.error('❌ Review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update report status (triage/company only)
router.put('/:id/status', authenticate, authorize('triage', 'company'), async (req, res) => {
  try {
    const { status, reward, feedback } = req.body;
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    const oldStatus = report.status;
    report.status = status;
    if (reward !== undefined) report.reward = reward;
    if (feedback) report.feedback = feedback;
    report.updatedAt = new Date();
    report.reviewedBy = req.user._id;
    
    await report.save();
    
    // Update user earnings if accepted with reward
    if (status === 'Accepted' && reward && oldStatus !== 'Accepted') {
      const user = await User.findById(report.userId);
      if (user) {
        user.totalEarnings += reward;
        await user.save();
      }
    }
    
    res.json({ success: true, message: 'Report updated successfully', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update report
router.put('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    // Only owner can update
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Don't allow updating status from user side
    const updates = req.body;
    delete updates.status;
    delete updates.reward;
    delete updates.feedback;
    delete updates.userId;
    
    Object.assign(report, updates);
    await report.save();
    
    res.json({ success: true, message: 'Report updated successfully', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete report
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    // Only owner or triage can delete
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'triage') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await Report.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

