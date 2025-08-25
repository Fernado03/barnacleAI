const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [254, 'Email address too long'],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ],
    validate: {
      validator: function(email) {
        // Additional email validation
        return email.length >= 5 && email.includes('@') && email.includes('.');
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    required: true,
    enum: ['Administrator', 'Ship Captain', 'Fleet Operator', 'Demo User'],
    default: 'Demo User'
    // Note: Administrator role should only be assigned manually by existing admins
    // Self-registration is restricted to: Ship Captain, Fleet Operator, Demo User
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ role: 1 });

// Virtual for user initials (used in frontend)
userSchema.virtual('initials').get(function() {
  if (this.firstName && this.lastName) {
    return (this.firstName.charAt(0) + this.lastName.charAt(0)).toUpperCase();
  }
  if (this.fullName) {
    const names = this.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return this.fullName.charAt(0).toUpperCase();
  }
  return 'U';
});

// Pre-save middleware to parse fullName into firstName and lastName
userSchema.pre('save', function(next) {
  // Split fullName into firstName and lastName if not provided
  if (this.fullName && (!this.firstName || !this.lastName)) {
    const names = this.fullName.trim().split(' ');
    this.firstName = names[0];
    this.lastName = names.length > 1 ? names.slice(1).join(' ') : names[0];
  }
  next();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  const config = require('../config/config');
  
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
    fullName: this.fullName,
    firstName: this.firstName,
    lastName: this.lastName
  };
  
  // Token expires in 7 days for remember me, 1 day otherwise
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'barn-secret-key', {
    expiresIn: '7d',
    issuer: 'barnacle-api',
    audience: 'barnacle-app'
  });
  
  return token;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Transform JSON output (remove password and version)
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  
  // Add initials to JSON output
  userObject.initials = this.initials;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;