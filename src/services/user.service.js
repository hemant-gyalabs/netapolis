/**
 * User Service
 * Handles API calls related to users and authentication
 */

import { api } from './api.service';
import { generateUsers } from '../utils/projectTestData';

// Mock implementation using test data
const useMockData = true;

export const userService = {
  /**
   * Get all users
   * @returns {Promise} - API response
   */
  async getAllUsers() {
    try {
      if (useMockData) {
        // Generate mock users
        const users = generateUsers(10);
        
        return {
          status: 'success',
          data: {
            users
          }
        };
      }
      
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get user by ID
   * @param {String} id - User ID
   * @returns {Promise} - API response
   */
  async getUserById(id) {
    try {
      if (useMockData) {
        const users = generateUsers(10);
        const user = users.find(u => u._id === id) || users[0];
        user._id = id;
        
        return {
          status: 'success',
          data: {
            user
          }
        };
      }
      
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get current user
   * @returns {Promise} - API response
   */
  async getCurrentUser() {
    try {
      if (useMockData) {
        const user = {
          _id: 'current_user',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'admin'
        };
        
        return {
          status: 'success',
          data: {
            user
          }
        };
      }
      
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @returns {Promise} - API response
   */
  async login(credentials) {
    try {
      if (useMockData) {
        // Mock successful login
        return {
          status: 'success',
          data: {
            token: 'mock_token',
            user: {
              _id: 'current_user',
              firstName: 'John',
              lastName: 'Doe',
              email: credentials.email,
              role: 'admin'
            }
          }
        };
      }
      
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Logout user
   * @returns {Promise} - API response
   */
  async logout() {
    try {
      if (useMockData) {
        // Mock successful logout
        return {
          status: 'success',
          data: null
        };
      }
      
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};