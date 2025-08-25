const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateSignupData, validateLoginData } = require('../utils/validation');

// Helper function to generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'barn-secret-key', {
    expiresIn: '7d',
    issuer: 'barnacle-api',
    audience: 'barnacle-app'
  });
};

// Helper function to send user response
const sendUserResponse = (res, user, token, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data: {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        initials: user.initials,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      token
    }
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role, agreeToTerms } = req.body;

    // Validate input data using utility function
    const validation = validateSignupData({ fullName, email, password, agreeToTerms });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0] // Return first error
      });
    }

    const { email: validatedEmail, fullName: validatedFullName, firstName, lastName } = validation.validatedData;

    // Validate role if provided - restrict Administrator access
    const allowedSelfSelectRoles = ['Ship Captain', 'Fleet Operator', 'Demo User'];
    const userRole = role && allowedSelfSelectRoles.includes(role) ? role : 'Demo User';
    
    // Log security attempt if user tries to set Administrator role
    if (role === 'Administrator') {
      console.warn(`Security Alert: User attempted to self-assign Administrator role - Email: ${validatedEmail}`);
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(validatedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }
    
    // Create new user with validated data
    const userData = {
      fullName: validatedFullName,
      firstName,
      lastName,
      email: validatedEmail,
      password,
      role: userRole // Use validated role or default to 'Demo User'
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response
    sendUserResponse(res, user, token, 'Account created successfully');

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during account creation'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input data using utility function
    const validation = validateLoginData({ email, password });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0] // Return first error
      });
    }

    const { email: validatedEmail } = validation.validatedData;

    // Find user by email
    const user = await User.findByEmail(validatedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response
    sendUserResponse(res, user, token, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Logout user (optional - mainly for client-side)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is mainly handled client-side
    // by removing the token from storage. This endpoint can be used for
    // logging or additional cleanup if needed.
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

// @desc    Verify token and get user info
// @route   POST /api/auth/verify
// @access  Public
const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'barn-secret-key');
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during token verification'
    });
  }
};

// @desc    Promote user role (Admin only)
// @route   PUT /api/auth/promote-user
// @access  Private (Administrator only)
const promoteUserRole = async (req, res, next) => {
  try {
    const { userId, newRole } = req.body;
    const adminUser = req.user; // From auth middleware

    // Check if current user is Administrator
    if (adminUser.role !== 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges required.'
      });
    }

    // Validate new role
    const validRoles = ['Administrator', 'Ship Captain', 'Fleet Operator', 'Demo User'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    // Log the role change for security audit
    console.log(`Role Change: ${adminUser.email} promoted ${user.email} from ${oldRole} to ${newRole}`);

    res.status(200).json({
      success: true,
      message: `User role updated from ${oldRole} to ${newRole}`,
      data: {
        userId: user._id,
        email: user.email,
        oldRole,
        newRole,
        updatedBy: adminUser.email
      }
    });

  } catch (error) {
    console.error('Promote user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.user.id;

    // Check if user is Administrator (admins cannot update their profile)
    if (req.user.role === 'Administrator') {
      return res.status(403).json({
        success: false,
        message: 'Administrator profiles cannot be modified for security purposes'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validate input
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already in use by another account'
        });
      }
    }

    // Update user profile
    const names = fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : names[0];

    user.fullName = fullName.trim();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email.toLowerCase().trim();
    user.updatedAt = new Date();

    await user.save();

    // Generate new token with updated information
    const token = generateToken(user);

    // Send response with updated user data
    sendUserResponse(res, user, token, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already in use'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during profile update'
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  logout,
  verifyToken,
  promoteUserRole
};