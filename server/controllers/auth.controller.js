/**
 * Authentication Controller
 * Handles user registration, login, logout, password reset, etc.
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN, NODE_ENV } = require('../config/config');

// Create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Send JWT as cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === 'production'
  };
  
  // Remove password from output
  user.password = undefined;
  
  res.cookie('jwt', token, cookieOptions);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
    
    // Create new user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role, // This should be restricted in production
      phone: req.body.phone,
      position: req.body.position,
      department: req.body.department
    });
    
    // Send token
    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // Send token
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * GET /api/auth/logout
 */
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success'
  });
};

/**
 * Get current user
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 * PATCH /api/auth/update-password
 */
exports.updatePassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Get user
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = req.body.newPassword;
    await user.save();
    
    // Send new token
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // For security, always return success response even if email doesn't exist
    res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive a password reset link shortly'
    });
    
    // In a real implementation, this would send an email with a reset token
    // For this demo, we'll keep it simple
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * PATCH /api/auth/reset-password/:token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // In a real implementation, this would verify the reset token
    // For this demo, we'll keep it simple
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};