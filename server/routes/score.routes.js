/**
 * Score Routes
 */

const express = require('express');
const { body } = require('express-validator');
const scoreController = require('../controllers/score.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { USER_ROLES } = require('../config/config');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

/**
 * @route   GET /api/scores
 * @desc    Get all scores with filtering
 * @access  Private
 */
router.get('/', scoreController.getAllScores);

/**
 * @route   GET /api/scores/stats
 * @desc    Get score statistics
 * @access  Private
 */
router.get('/stats', scoreController.getScoreStats);

/**
 * @route   GET /api/scores/top
 * @desc    Get top scores
 * @access  Private
 */
router.get('/top', scoreController.getTopScores);

/**
 * @route   GET /api/scores/recent
 * @desc    Get recent scores
 * @access  Private
 */
router.get('/recent', scoreController.getRecentScores);

/**
 * @route   GET /api/scores/agent-performance
 * @desc    Get agent performance for leaderboard
 * @access  Private
 */
router.get('/agent-performance', scoreController.getAgentPerformance);

/**
 * @route   GET /api/scores/lead-conversions
 * @desc    Get lead conversion stats
 * @access  Private
 */
router.get('/lead-conversions', scoreController.getLeadConversions);

/**
 * @route   GET /api/scores/property-analytics
 * @desc    Get property score analytics
 * @access  Private
 */
router.get('/property-analytics', scoreController.getPropertyAnalytics);

/**
 * @route   POST /api/scores/test-data
 * @desc    Create test scores (for development only)
 * @access  Private/Admin
 */
router.post(
  '/test-data',
  authMiddleware.restrictTo(USER_ROLES.ADMIN),
  scoreController.createTestScores
);

/**
 * @route   GET /api/scores/:type
 * @desc    Get scores by type (lead, property, agent)
 * @access  Private
 */
router.get('/:type', scoreController.getScoresByType);

/**
 * @route   GET /api/scores/:id
 * @desc    Get score by ID
 * @access  Private
 */
router.get('/:id', scoreController.getScoreById);

/**
 * @route   POST /api/scores
 * @desc    Create a new score
 * @access  Private
 */
router.post(
  '/',
  [
    body('type')
      .isIn(['lead', 'property', 'agent'])
      .withMessage('Score type must be lead, property, or agent'),
    body('score')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
    body('scoreFactors')
      .optional()
      .isArray()
      .withMessage('Score factors must be an array'),
    body('scoreFactors.*.factor')
      .optional()
      .isString()
      .withMessage('Score factor name must be a string'),
    body('scoreFactors.*.weight')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Score factor weight must be between 0 and 1'),
    body('scoreFactors.*.value')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Score factor value must be between 0 and 100')
  ],
  scoreController.createScore
);

/**
 * @route   PATCH /api/scores/:id
 * @desc    Update a score
 * @access  Private
 */
router.patch(
  '/:id',
  [
    body('score')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
    body('scoreFactors')
      .optional()
      .isArray()
      .withMessage('Score factors must be an array'),
    body('scoreFactors.*.factor')
      .optional()
      .isString()
      .withMessage('Score factor name must be a string'),
    body('scoreFactors.*.weight')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Score factor weight must be between 0 and 1'),
    body('scoreFactors.*.value')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Score factor value must be between 0 and 100')
  ],
  scoreController.updateScore
);

/**
 * @route   DELETE /api/scores/:id
 * @desc    Delete a score
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  scoreController.deleteScore
);

module.exports = router;