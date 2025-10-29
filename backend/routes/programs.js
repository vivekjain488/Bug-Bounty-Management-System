import express from 'express';
import Program from '../models/Program.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .populate('companyId', 'companyName industry website isVerified');
    res.json({ success: true, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single program
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('companyId', 'companyName industry website isVerified');
    
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    res.json({ success: true, program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create program (company only)
router.post('/', authenticate, authorize('company'), async (req, res) => {
  try {
    // Calculate min and max bounties from reward structure
    const rewards = req.body.rewardStructure;
    const allMins = Object.values(rewards).map(r => {
      const match = r.match(/\$(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const allMaxs = Object.values(rewards).map(r => {
      const match = r.match(/\$\d+ - \$(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    const programData = {
      ...req.body,
      companyId: req.user._id,
      minBounty: Math.min(...allMins),
      maxBounty: Math.max(...allMaxs),
      isActive: true,
      totalReports: 0,
      acceptedReports: 0,
      totalBountyPaid: 0
    };
    
    const program = new Program(programData);
    await program.save();
    
    // Update company stats
    const user = await User.findById(req.user._id);
    if (user) {
      user.programsCreated += 1;
      await user.save();
    }
    
    res.status(201).json({ success: true, message: 'Program created successfully', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update program
router.put('/:id', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    // Only owner can update
    if (program.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    Object.assign(program, req.body);
    await program.save();
    
    res.json({ success: true, message: 'Program updated successfully', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete program
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    // Only owner can delete
    if (program.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    await Program.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get company's programs
router.get('/company/my', authenticate, async (req, res) => {
  try {
    const programs = await Program.find({ companyId: req.user._id });
    res.json({ success: true, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

import User from '../models/User.js';

export default router;

