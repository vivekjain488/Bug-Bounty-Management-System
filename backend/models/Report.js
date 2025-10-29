import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: String,
    required: true
  },
  programId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stepsToReproduce: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending Review', 'In Review', 'Accepted', 'Rejected', 'Duplicate', 'Informative', 'Not Applicable'],
    default: 'Pending Review'
  },
  reward: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    type: String
  }],
  cvss: {
    type: String,
    default: null
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;

