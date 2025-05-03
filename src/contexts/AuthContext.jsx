import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/auth.service';

// Create the context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();
      if (response.status === 'success') {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (error) {
      setUser(null);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      if (response.status === 'success') {
        setUser(response.data.user);
        setError(null);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      if (response.status === 'success') {
        setUser(response.data.user);
        setError(null);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
      return true;
    } catch (error) {
      setError(error.message || 'Logout failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(userData);
      if (response.status === 'success') {
        setUser(response.data.user);
        setError(null);
        return true;
      } else {
        setError(response.message || 'Update failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authService.updatePassword(passwordData);
      if (response.status === 'success') {
        setError(null);
        return true;
      } else {
        setError(response.message || 'Password change failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Password change failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Request password reset
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      if (response.status === 'success') {
        setError(null);
        return true;
      } else {
        setError(response.message || 'Request failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Request failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(token, password);
      if (response.status === 'success') {
        setError(null);
        return true;
      } else {
        setError(response.message || 'Reset failed');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Reset failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    checkAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    hasRole,
    clearError
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};