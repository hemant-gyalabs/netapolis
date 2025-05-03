/**
 * Authentication Service
 * Handles API calls related to authentication and user management
 */

import { api } from './api.service';

// Helper functions for localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

// Auth service methods
export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Login a user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise} - API response
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Logout a user
   * @returns {Promise} - API response
   */
  async logout() {
    try {
      await api.get('/auth/logout');
      removeToken();
      return { status: 'success' };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get current user data
   * @returns {Promise} - API response
   */
  async getCurrentUser() {
    try {
      if (!getToken()) {
        return { status: 'error', message: 'No token found' };
      }
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User profile data
   * @returns {Promise} - API response
   */
  async updateProfile(userData) {
    try {
      const response = await api.patch('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update user password
   * @param {Object} passwordData - Password update data
   * @returns {Promise} - API response
   */
  async updatePassword(passwordData) {
    try {
      const response = await api.patch('/auth/update-password', passwordData);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Request password reset
   * @param {String} email - User email
   * @returns {Promise} - API response
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Reset password with token
   * @param {String} token - Reset token
   * @param {String} password - New password
   * @returns {Promise} - API response
   */
  async resetPassword(token, password) {
    try {
      const response = await api.patch(`/auth/reset-password/${token}`, {
        password,
        confirmPassword: password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {Boolean} - Authentication status
   */
  isAuthenticated() {
    return !!getToken();
  },
  
  /**
   * Get auth token
   * @returns {String} - JWT token
   */
  getToken
};