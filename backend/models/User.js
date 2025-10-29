import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'company', 'triage'],
    required: true,
    default: 'user'
  },
  
  // Common fields
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // User-specific fields (researcher)
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  reportsSubmitted: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Beginner'
  },
  
  // Company-specific fields
  companyName: {
    type: String
  },
  industry: {
    type: String
  },
  website: {
    type: String
  },
  programsCreated: {
    type: Number,
    default: 0
  },
  totalBountyPaid: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Triage-specific fields
  department: {
    type: String
  },
  reportsReviewed: {
    type: Number,
    default: 0
  },
  averageReviewTime: {
    type: Number,
    default: 0
  },
  specializations: [{
    type: String
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;

