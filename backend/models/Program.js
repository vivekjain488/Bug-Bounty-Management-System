import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: '🏢'
  },
  industry: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High'
  },
  minBounty: {
    type: Number,
    required: true
  },
  maxBounty: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  about: {
    type: String,
    default: ''
  },
  scope: [{
    type: String
  }],
  outOfScope: [{
    type: String
  }],
  rules: [{
    type: String
  }],
  rewardStructure: {
    Critical: String,
    High: String,
    Medium: String,
    Low: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalReports: {
    type: Number,
    default: 0
  },
  acceptedReports: {
    type: Number,
    default: 0
  },
  totalBountyPaid: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Program = mongoose.model('Program', programSchema);

export default Program;

