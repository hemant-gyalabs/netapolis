/**
 * Score Controller
 * Handles API requests related to scores (leads, properties, agents)
 */

const { validationResult } = require('express-validator');
const Score = require('../models/score.model');
const User = require('../models/user.model');

/**
 * Get all scores with filtering
 * GET /api/scores
 */
exports.getAllScores = async (req, res, next) => {
  try {
    // Extract query parameters
    const { type, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    
    // Build sort options
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    else sort.createdAt = -1; // Default sort by createdAt desc
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const scores = await Score.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('leadDetails.assignedTo', 'firstName lastName email')
      .populate('agentDetails.user', 'firstName lastName email');
    
    // Count total documents
    const total = await Score.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: scores.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        scores
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get scores by type (lead, property, agent)
 * GET /api/scores/:type
 */
exports.getScoresByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    // Validate type
    if (!['lead', 'property', 'agent'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid score type. Must be lead, property, or agent.'
      });
    }
    
    // Extract query parameters
    const { sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    // Build sort options
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    else sort.score = -1; // Default sort by score desc
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const scores = await Score.find({ type })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('leadDetails.assignedTo', 'firstName lastName email')
      .populate('agentDetails.user', 'firstName lastName email');
    
    // Count total documents
    const total = await Score.countDocuments({ type });
    
    res.status(200).json({
      status: 'success',
      results: scores.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        scores
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get score by ID
 * GET /api/scores/:id
 */
exports.getScoreById = async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('leadDetails.assignedTo', 'firstName lastName email')
      .populate('agentDetails.user', 'firstName lastName email');
    
    if (!score) {
      return res.status(404).json({
        status: 'error',
        message: 'Score not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        score
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new score
 * POST /api/scores
 */
exports.createScore = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Set the creator
    req.body.createdBy = req.user.id;
    
    // Create the score
    const newScore = await Score.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        score: newScore
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a score
 * PATCH /api/scores/:id
 */
exports.updateScore = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find and update the score
    const score = await Score.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run validation on update
      }
    );
    
    if (!score) {
      return res.status(404).json({
        status: 'error',
        message: 'Score not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        score
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a score
 * DELETE /api/scores/:id
 */
exports.deleteScore = async (req, res, next) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    
    if (!score) {
      return res.status(404).json({
        status: 'error',
        message: 'Score not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get score statistics
 * GET /api/scores/stats
 */
exports.getScoreStats = async (req, res, next) => {
  try {
    // Get average scores by type
    const averageScores = await Score.aggregate([
      {
        $group: {
          _id: '$type',
          averageScore: { $avg: '$score' },
          count: { $sum: 1 },
          highScores: { 
            $sum: { 
              $cond: [{ $gte: ['$score', 80] }, 1, 0] 
            } 
          },
          mediumScores: { 
            $sum: { 
              $cond: [
                { $and: [
                  { $gte: ['$score', 50] },
                  { $lt: ['$score', 80] }
                ]}, 
                1, 
                0
              ] 
            } 
          },
          lowScores: { 
            $sum: { 
              $cond: [{ $lt: ['$score', 50] }, 1, 0] 
            } 
          }
        }
      }
    ]);
    
    // Get lead conversion stats
    const leadStats = await Score.aggregate([
      {
        $match: { type: 'lead' }
      },
      {
        $group: {
          _id: '$leadDetails.status',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    
    // Get property stats
    const propertyStats = await Score.aggregate([
      {
        $match: { type: 'property' }
      },
      {
        $group: {
          _id: '$propertyDetails.type',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    
    // Get agent stats
    const agentStats = await Score.aggregate([
      {
        $match: { type: 'agent' }
      },
      {
        $group: {
          _id: '$agentDetails.period',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    
    // Get score trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const scoreTrend = await Score.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            type: '$type'
          },
          averageScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    // Calculate score distribution
    const scoreDistribution = await Score.aggregate([
      {
        $group: {
          _id: {
            range: {
              $switch: {
                branches: [
                  { case: { $lt: ['$score', 20] }, then: '0-20' },
                  { case: { $lt: ['$score', 40] }, then: '21-40' },
                  { case: { $lt: ['$score', 60] }, then: '41-60' },
                  { case: { $lt: ['$score', 80] }, then: '61-80' },
                  { case: { $lte: ['$score', 100] }, then: '81-100' },
                ],
                default: 'unknown'
              }
            },
            type: '$type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.range': 1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        averageScores,
        leadStats,
        propertyStats,
        agentStats,
        scoreTrend,
        scoreDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get top scores
 * GET /api/scores/top
 */
exports.getTopScores = async (req, res, next) => {
  try {
    const { type, limit = 5 } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    
    // Get top scores
    const topScores = await Score.find(query)
      .sort({ score: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('leadDetails.assignedTo', 'firstName lastName email')
      .populate('agentDetails.user', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      results: topScores.length,
      data: {
        scores: topScores
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent scores
 * GET /api/scores/recent
 */
exports.getRecentScores = async (req, res, next) => {
  try {
    const { type, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    
    // Get recent scores
    const recentScores = await Score.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('leadDetails.assignedTo', 'firstName lastName email')
      .populate('agentDetails.user', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      results: recentScores.length,
      data: {
        scores: recentScores
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get agent performance (for agent leaderboard)
 * GET /api/scores/agent-performance
 */
exports.getAgentPerformance = async (req, res, next) => {
  try {
    // Get agent scores
    const agentScores = await Score.find({ type: 'agent' })
      .populate('agentDetails.user', 'firstName lastName email profileImage')
      .sort({ score: -1 })
      .limit(10);
    
    // Process for leaderboard
    const leaderboard = agentScores.map(score => ({
      id: score._id,
      agentId: score.agentDetails.user._id,
      name: `${score.agentDetails.user.firstName} ${score.agentDetails.user.lastName}`,
      email: score.agentDetails.user.email,
      profileImage: score.agentDetails.user.profileImage,
      score: score.score,
      performance: score.agentDetails.performance,
      period: score.agentDetails.period
    }));
    
    res.status(200).json({
      status: 'success',
      results: leaderboard.length,
      data: {
        leaderboard
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lead conversion stats
 * GET /api/scores/lead-conversions
 */
exports.getLeadConversions = async (req, res, next) => {
  try {
    // Get conversion rates by status
    const conversionStats = await Score.aggregate([
      {
        $match: { type: 'lead' }
      },
      {
        $group: {
          _id: '$leadDetails.status',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Get conversion trend over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const conversionTrend = await Score.aggregate([
      {
        $match: {
          type: 'lead',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            status: '$leadDetails.status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    // Get conversion by source
    const conversionBySource = await Score.aggregate([
      {
        $match: { type: 'lead' }
      },
      {
        $group: {
          _id: '$leadDetails.source',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          converted: { 
            $sum: { 
              $cond: [
                { $in: ['$leadDetails.status', ['qualified', 'negotiation', 'closed']] }, 
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);
    
    // Calculate conversion rates
    const sourceWithRates = conversionBySource.map(source => ({
      source: source._id,
      count: source.count,
      averageScore: source.averageScore,
      converted: source.converted,
      conversionRate: (source.converted / source.count) * 100
    }));
    
    res.status(200).json({
      status: 'success',
      data: {
        conversionStats,
        conversionTrend,
        conversionBySource: sourceWithRates
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property score analytics
 * GET /api/scores/property-analytics
 */
exports.getPropertyAnalytics = async (req, res, next) => {
  try {
    // Get property scores by type
    const scoresByType = await Score.aggregate([
      {
        $match: { type: 'property' }
      },
      {
        $group: {
          _id: '$propertyDetails.type',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePrice: { $avg: '$propertyDetails.price' }
        }
      }
    ]);
    
    // Get property scores by location
    const scoresByLocation = await Score.aggregate([
      {
        $match: { type: 'property' }
      },
      {
        $group: {
          _id: '$propertyDetails.location.area',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePrice: { $avg: '$propertyDetails.price' }
        }
      },
      {
        $sort: { averageScore: -1 }
      }
    ]);
    
    // Get property scores by status
    const scoresByStatus = await Score.aggregate([
      {
        $match: { type: 'property' }
      },
      {
        $group: {
          _id: '$propertyDetails.status',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    
    // Get property price vs score correlation
    const priceScoreCorrelation = await Score.aggregate([
      {
        $match: { 
          type: 'property',
          'propertyDetails.price': { $exists: true }
        }
      },
      {
        $project: {
          price: '$propertyDetails.price',
          score: '$score',
          priceRange: {
            $switch: {
              branches: [
                { case: { $lt: ['$propertyDetails.price', 2000000] }, then: 'Under 20L' },
                { case: { $lt: ['$propertyDetails.price', 5000000] }, then: '20L-50L' },
                { case: { $lt: ['$propertyDetails.price', 10000000] }, then: '50L-1Cr' },
                { case: { $lt: ['$propertyDetails.price', 20000000] }, then: '1Cr-2Cr' },
                { case: { $gte: ['$propertyDetails.price', 20000000] }, then: 'Above 2Cr' },
              ],
              default: 'Unknown'
            }
          }
        }
      },
      {
        $group: {
          _id: '$priceRange',
          averageScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        scoresByType,
        scoresByLocation,
        scoresByStatus,
        priceScoreCorrelation
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create test scores (for development only)
 * POST /api/scores/test-data
 */
exports.createTestScores = async (req, res, next) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        status: 'error',
        message: 'This endpoint is only available in development environment'
      });
    }
    
    // Get all users
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No users found to create test scores'
      });
    }
    
    // Sample data
    const areas = ['Kokapet', 'Narsingi', 'Manchirevula', 'Tellapur', 'Kollur'];
    const propertyTypes = ['residential', 'commercial', 'land'];
    const propertyStatus = ['available', 'pending', 'sold'];
    const leadStatuses = ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'];
    const leadSources = ['website', 'referral', 'social', 'advertisement', 'direct'];
    
    // Create lead scores
    const leadScores = [];
    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      const randomStatus = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
      const randomSource = leadSources[Math.floor(Math.random() * leadSources.length)];
      const randomScore = Math.floor(Math.random() * 100) + 1;
      
      leadScores.push({
        type: 'lead',
        score: randomScore,
        notes: `Test lead score ${i + 1}`,
        leadDetails: {
          name: `Test Lead ${i + 1}`,
          email: `lead${i + 1}@example.com`,
          phone: `+91 98765${i.toString().padStart(5, '0')}`,
          budget: {
            min: 2000000 + (i * 500000),
            max: 5000000 + (i * 500000)
          },
          interestedIn: [`${randomArea} ${propertyTypes[i % 3]}`],
          source: randomSource,
          status: randomStatus,
          assignedTo: randomUser._id
        },
        scoreFactors: [
          {
            factor: 'Budget Match',
            weight: 0.3,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Communication Responsiveness',
            weight: 0.2,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Property Type Match',
            weight: 0.3,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Timeline',
            weight: 0.2,
            value: Math.floor(Math.random() * 100) + 1
          }
        ],
        createdBy: randomUser._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
      });
    }
    
    // Create property scores
    const propertyScores = [];
    for (let i = 0; i < 15; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const randomStatus = propertyStatus[Math.floor(Math.random() * propertyStatus.length)];
      const randomScore = Math.floor(Math.random() * 100) + 1;
      const randomPrice = (Math.floor(Math.random() * 20) + 5) * 1000000; // 50L to 2.5Cr
      
      propertyScores.push({
        type: 'property',
        score: randomScore,
        notes: `Test property score ${i + 1}`,
        propertyDetails: {
          name: `${randomArea} ${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Property ${i + 1}`,
          location: {
            area: randomArea,
            city: 'Hyderabad'
          },
          type: randomType,
          price: randomPrice,
          size: (Math.floor(Math.random() * 5000) + 1000),
          amenities: ['parking', 'security', 'power backup', 'water supply'],
          status: randomStatus
        },
        scoreFactors: [
          {
            factor: 'Location',
            weight: 0.3,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Price',
            weight: 0.25,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Growth Potential',
            weight: 0.25,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Amenities',
            weight: 0.2,
            value: Math.floor(Math.random() * 100) + 1
          }
        ],
        createdBy: randomUser._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
      });
    }
    
    // Create agent scores
    const agentScores = [];
    for (let i = 0; i < users.length; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomScore = Math.floor(Math.random() * 100) + 1;
      
      agentScores.push({
        type: 'agent',
        score: randomScore,
        notes: `Test agent score for ${users[i].firstName} ${users[i].lastName}`,
        agentDetails: {
          user: users[i]._id,
          performance: {
            leadsHandled: Math.floor(Math.random() * 50) + 10,
            conversionRate: Math.floor(Math.random() * 50) + 10,
            revenueGenerated: Math.floor(Math.random() * 10000000) + 1000000,
            customerSatisfaction: Math.floor(Math.random() * 50) + 50,
            responseTime: Math.floor(Math.random() * 20) + 1
          },
          period: 'monthly'
        },
        scoreFactors: [
          {
            factor: 'Lead Conversion',
            weight: 0.3,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Revenue Generation',
            weight: 0.3,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Customer Satisfaction',
            weight: 0.2,
            value: Math.floor(Math.random() * 100) + 1
          },
          {
            factor: 'Response Time',
            weight: 0.2,
            value: Math.floor(Math.random() * 100) + 1
          }
        ],
        createdBy: randomUser._id,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
      });
    }
    
    // Insert all test scores
    await Score.deleteMany({}); // Clear existing scores
    await Score.insertMany([...leadScores, ...propertyScores, ...agentScores]);
    
    res.status(201).json({
      status: 'success',
      message: 'Test scores created successfully',
      data: {
        leadScores: leadScores.length,
        propertyScores: propertyScores.length,
        agentScores: agentScores.length
      }
    });
  } catch (error) {
    next(error);
  }
};