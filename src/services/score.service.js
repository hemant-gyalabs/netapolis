/**
 * Score Service
 * Handles API calls for score-related functionality
 */

import { api } from './api.service';
import { generateScoreStats, generateTopScores, generateScores } from '../utils/scoreTestData';

// Mock implementation using test data
const useMockData = true;

export const scoreService = {
  /**
   * Get all scores with filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAllScores(params = {}) {
    try {
      if (useMockData) {
        // Generate mock data
        const scores = generateScores(20);
        
        // Apply filtering (simple implementation)
        let filteredScores = [...scores];
        
        // Apply type filter
        if (params.type) {
          filteredScores = filteredScores.filter(score => score.type === params.type);
        }
        
        // Sort (simple implementation)
        if (params.sortBy) {
          filteredScores.sort((a, b) => {
            const valueA = a[params.sortBy];
            const valueB = b[params.sortBy];
            return params.sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
          });
        } else {
          // Default sort by score desc
          filteredScores.sort((a, b) => b.score - a.score);
        }
        
        // Paginate
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedScores = filteredScores.slice(startIndex, endIndex);
        
        // Create response
        return {
          status: 'success',
          data: {
            scores: paginatedScores
          },
          pagination: {
            total: filteredScores.length,
            page: page,
            limit: limit,
            pages: Math.ceil(filteredScores.length / limit)
          }
        };
      }
      
      const response = await api.get('/scores', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get scores by type (lead, property, agent)
   * @param {String} type - Score type
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getScoresByType(type, params = {}) {
    try {
      if (useMockData) {
        // Generate mock data
        const scores = generateScores(20).filter(score => score.type === type);
        
        // Sort (simple implementation)
        if (params.sortBy) {
          scores.sort((a, b) => {
            const valueA = a[params.sortBy];
            const valueB = b[params.sortBy];
            return params.sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
          });
        } else {
          // Default sort by score desc
          scores.sort((a, b) => b.score - a.score);
        }
        
        // Paginate
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedScores = scores.slice(startIndex, endIndex);
        
        // Create response
        return {
          status: 'success',
          data: {
            scores: paginatedScores
          },
          pagination: {
            total: scores.length,
            page: page,
            limit: limit,
            pages: Math.ceil(scores.length / limit)
          }
        };
      }
      
      const response = await api.get(`/scores/${type}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get score by ID
   * @param {String} id - Score ID
   * @returns {Promise} - API response
   */
  async getScoreById(id) {
    try {
      if (useMockData) {
        // Generate a single score with the given ID
        const scores = generateScores(1);
        scores[0]._id = id;
        
        return {
          status: 'success',
          data: {
            score: scores[0]
          }
        };
      }
      
      const response = await api.get(`/scores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a new score
   * @param {Object} scoreData - Score data
   * @returns {Promise} - API response
   */
  async createScore(scoreData) {
    try {
      if (useMockData) {
        // Generate a single score with the given data
        const score = {
          _id: `score_${Math.floor(Math.random() * 1000)}`,
          ...scoreData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            score
          }
        };
      }
      
      const response = await api.post('/scores', scoreData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update a score
   * @param {String} id - Score ID
   * @param {Object} scoreData - Updated score data
   * @returns {Promise} - API response
   */
  async updateScore(id, scoreData) {
    try {
      if (useMockData) {
        // Generate a single score with the given ID and data
        const score = {
          _id: id,
          ...scoreData,
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            score
          }
        };
      }
      
      const response = await api.patch(`/scores/${id}`, scoreData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Delete a score
   * @param {String} id - Score ID
   * @returns {Promise} - API response
   */
  async deleteScore(id) {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: null
        };
      }
      
      const response = await api.delete(`/scores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get score statistics
   * @returns {Promise} - API response
   */
  async getScoreStats() {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: generateScoreStats()
        };
      }
      
      const response = await api.get('/scores/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get top scores
   * @param {String} type - Score type (optional)
   * @param {Number} limit - Number of scores to return (optional)
   * @returns {Promise} - API response
   */
  async getTopScores(type, limit = 5) {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: {
            scores: generateTopScores(type, limit)
          }
        };
      }
      
      const params = {};
      if (type) params.type = type;
      if (limit) params.limit = limit;
      
      const response = await api.get('/scores/top', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get recent scores
   * @param {String} type - Score type (optional)
   * @param {Number} limit - Number of scores to return (optional)
   * @returns {Promise} - API response
   */
  async getRecentScores(type, limit = 10) {
    try {
      if (useMockData) {
        // Generate scores and sort by createdAt
        const scores = generateScores(limit, type)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return {
          status: 'success',
          data: {
            scores
          }
        };
      }
      
      const params = {};
      if (type) params.type = type;
      if (limit) params.limit = limit;
      
      const response = await api.get('/scores/recent', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get agent performance (for leaderboard)
   * @returns {Promise} - API response
   */
  async getAgentPerformance() {
    try {
      if (useMockData) {
        // Generate agent scores for leaderboard
        const agents = generateTopScores('agent', 10);
        
        // Process for leaderboard
        const leaderboard = agents.map(score => ({
          id: score._id,
          agentId: score.agentDetails.user._id,
          name: `${score.agentDetails.user.firstName} ${score.agentDetails.user.lastName}`,
          email: score.agentDetails.user.email,
          score: score.score,
          performance: score.agentDetails.performance,
          period: score.agentDetails.period
        }));
        
        return {
          status: 'success',
          data: {
            leaderboard
          }
        };
      }
      
      const response = await api.get('/scores/agent-performance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get lead conversion stats
   * @returns {Promise} - API response
   */
  async getLeadConversions() {
    try {
      if (useMockData) {
        const stats = generateScoreStats();
        
        // Create mock conversion data
        const conversionStats = stats.leadStats;
        
        // Create mock trend data
        const conversionTrend = [];
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthNum = month.getMonth() + 1;
          const year = month.getFullYear();
          
          for (const status of ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost']) {
            conversionTrend.push({
              _id: {
                month: monthNum,
                year,
                status
              },
              count: Math.floor(Math.random() * 10) + 1
            });
          }
        }
        
        // Create mock source data
        const conversionBySource = [
          {
            source: 'website',
            count: Math.floor(Math.random() * 50) + 20,
            averageScore: Math.floor(Math.random() * 30) + 60,
            converted: Math.floor(Math.random() * 15) + 5,
            conversionRate: Math.floor(Math.random() * 30) + 10
          },
          {
            source: 'referral',
            count: Math.floor(Math.random() * 30) + 10,
            averageScore: Math.floor(Math.random() * 20) + 70,
            converted: Math.floor(Math.random() * 10) + 5,
            conversionRate: Math.floor(Math.random() * 40) + 20
          },
          {
            source: 'social',
            count: Math.floor(Math.random() * 20) + 10,
            averageScore: Math.floor(Math.random() * 20) + 60,
            converted: Math.floor(Math.random() * 5) + 2,
            conversionRate: Math.floor(Math.random() * 20) + 10
          },
          {
            source: 'advertisement',
            count: Math.floor(Math.random() * 15) + 5,
            averageScore: Math.floor(Math.random() * 30) + 50,
            converted: Math.floor(Math.random() * 3) + 1,
            conversionRate: Math.floor(Math.random() * 15) + 5
          }
        ];
        
        return {
          status: 'success',
          data: {
            conversionStats,
            conversionTrend,
            conversionBySource
          }
        };
      }
      
      const response = await api.get('/scores/lead-conversions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get property score analytics
   * @returns {Promise} - API response
   */
  async getPropertyAnalytics() {
    try {
      if (useMockData) {
        const stats = generateScoreStats();
        
        // Use property stats
        const scoresByType = stats.propertyStats;
        
        // Create mock location data
        const areas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kukatpally'];
        const scoresByLocation = areas.map(area => ({
          _id: area,
          count: Math.floor(Math.random() * 10) + 2,
          averageScore: Math.floor(Math.random() * 30) + 60,
          averagePrice: Math.floor(Math.random() * 5000000) + 3000000
        })).sort((a, b) => b.averageScore - a.averageScore);
        
        // Create mock status data
        const scoresByStatus = [
          {
            _id: 'available',
            count: Math.floor(Math.random() * 20) + 10,
            averageScore: Math.floor(Math.random() * 20) + 70
          },
          {
            _id: 'pending',
            count: Math.floor(Math.random() * 10) + 5,
            averageScore: Math.floor(Math.random() * 15) + 75
          },
          {
            _id: 'sold',
            count: Math.floor(Math.random() * 5) + 3,
            averageScore: Math.floor(Math.random() * 10) + 80
          }
        ];
        
        // Create mock price correlation data
        const priceRanges = ['Under 20L', '20L-50L', '50L-1Cr', '1Cr-2Cr', 'Above 2Cr'];
        const priceScoreCorrelation = priceRanges.map((range, index) => ({
          _id: range,
          averageScore: 60 + (index * 5) + (Math.random() * 10 - 5),
          count: Math.floor(Math.random() * 10) + 2
        }));
        
        return {
          status: 'success',
          data: {
            scoresByType,
            scoresByLocation,
            scoresByStatus,
            priceScoreCorrelation
          }
        };
      }
      
      const response = await api.get('/scores/property-analytics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create test scores (for development only)
   * @returns {Promise} - API response
   */
  async createTestScores() {
    try {
      if (useMockData) {
        return {
          status: 'success',
          message: 'Test scores created successfully',
          data: {
            leadScores: 20,
            propertyScores: 15,
            agentScores: 10
          }
        };
      }
      
      const response = await api.post('/scores/test-data');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};