/**
 * Authentication Middleware
 * Handles user authentication and authorization
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const { JWT_SECRET, USER_ROLES } = require('../config/config');

/**
 * Protect routes - Require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }
    
    // Verify token
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }
    
    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password. Please log in again.'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }
    
    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};

/**
 * Restrict access to certain roles
 * @param  {...String} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }
    
    next();
  };
};

/**
 * Only allow users to modify their own resources
 * @param {String} paramName - Name of the parameter containing the resource ID
 * @param {Boolean} allowAdminOverride - Whether admins can modify any resource
 */
exports.restrictToOwner = (paramName, allowAdminOverride = true) => {
  return async (req, res, next) => {
    // Admin override
    if (allowAdminOverride && req.user.role === USER_ROLES.ADMIN) {
      return next();
    }
    
    // Get resource ID
    const resourceId = req.params[paramName];
    if (!resourceId) {
      return res.status(400).json({
        status: 'error',
        message: `Resource ID parameter '${paramName}' not found.`
      });
    }
    
    // Compare with user ID
    if (resourceId !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to modify this resource.'
      });
    }
    
    next();
  };
};