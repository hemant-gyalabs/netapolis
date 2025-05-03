/**
 * API Service
 * Handles HTTP requests to the backend API
 */

import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token if it exists
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // Format error message
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Create error object
    const formattedError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(formattedError);
  }
);

// Export the api instance
export { api };