/**
 * Server Configuration
 */

require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database configuration
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/neopolis-dashboard',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'neopolis-super-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 1,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // File upload configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  
  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    AGENT: 'agent'
  }
};