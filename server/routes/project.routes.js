/**
 * Project Routes
 */

const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { USER_ROLES } = require('../config/config');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filtering
 * @access  Private
 */
router.get('/', projectController.getAllProjects);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post(
  '/',
  [
    body('name')
      .notEmpty()
      .withMessage('Project name is required')
      .trim(),
    body('location.area')
      .notEmpty()
      .withMessage('Project area is required')
      .trim(),
    body('location.city')
      .notEmpty()
      .withMessage('Project city is required')
      .trim(),
    body('propertyType')
      .isIn(['residential', 'commercial', 'mixed', 'land'])
      .withMessage('Invalid property type'),
    body('startDate')
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('endDate')
      .isISO8601()
      .withMessage('End date must be a valid date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('budget.total')
      .isNumeric()
      .withMessage('Budget must be a number')
      .custom(value => {
        if (value <= 0) {
          throw new Error('Budget must be greater than 0');
        }
        return true;
      }),
    body('manager')
      .notEmpty()
      .withMessage('Project manager is required')
  ],
  projectController.createProject
);

/**
 * @route   GET /api/projects/stats
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/stats', projectController.getProjectStats);

/**
 * @route   GET /api/projects/my-tasks
 * @desc    Get user's assigned tasks across all projects
 * @access  Private
 */
router.get('/my-tasks', projectController.getMyTasks);

/**
 * @route   POST /api/projects/test-data
 * @desc    Create test projects (for development only)
 * @access  Private/Admin
 */
router.post(
  '/test-data',
  authMiddleware.restrictTo(USER_ROLES.ADMIN),
  projectController.createTestProjects
);

/**
 * @route   GET /api/projects/search
 * @desc    Search projects
 * @access  Private
 */
router.get('/search', projectController.searchProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', projectController.getProjectById);

/**
 * @route   PATCH /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.patch(
  '/:id',
  [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .trim(),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date'),
    body('status')
      .optional()
      .isIn(['planning', 'inProgress', 'onHold', 'completed', 'canceled'])
      .withMessage('Invalid status'),
    body('budget.total')
      .optional()
      .isNumeric()
      .withMessage('Budget must be a number')
      .custom(value => {
        if (value <= 0) {
          throw new Error('Budget must be greater than 0');
        }
        return true;
      }),
    body('budget.spent')
      .optional()
      .isNumeric()
      .withMessage('Spent budget must be a number')
      .custom(value => {
        if (value < 0) {
          throw new Error('Spent budget cannot be negative');
        }
        return true;
      })
  ],
  projectController.updateProject
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private/Admin/Manager
 */
router.delete(
  '/:id',
  authMiddleware.restrictTo(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  projectController.deleteProject
);

/**
 * @route   POST /api/projects/:id/tasks
 * @desc    Add a task to a project
 * @access  Private
 */
router.post(
  '/:id/tasks',
  [
    body('name')
      .notEmpty()
      .withMessage('Task name is required')
      .trim(),
    body('dueDate')
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('status')
      .optional()
      .isIn(['todo', 'inProgress', 'review', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority')
  ],
  projectController.addTask
);

/**
 * @route   PATCH /api/projects/:id/tasks/:taskId
 * @desc    Update a task
 * @access  Private
 */
router.patch(
  '/:id/tasks/:taskId',
  [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Task name cannot be empty')
      .trim(),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('status')
      .optional()
      .isIn(['todo', 'inProgress', 'review', 'done'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority')
  ],
  projectController.updateTask
);

/**
 * @route   DELETE /api/projects/:id/tasks/:taskId
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id/tasks/:taskId', projectController.deleteTask);

/**
 * @route   POST /api/projects/:id/comments
 * @desc    Add a comment to a project
 * @access  Private
 */
router.post(
  '/:id/comments',
  [
    body('text')
      .notEmpty()
      .withMessage('Comment text is required')
      .trim()
  ],
  projectController.addComment
);

/**
 * @route   POST /api/projects/:id/documents
 * @desc    Add a document to a project
 * @access  Private
 */
router.post(
  '/:id/documents',
  [
    body('name')
      .notEmpty()
      .withMessage('Document name is required')
      .trim(),
    body('fileUrl')
      .notEmpty()
      .withMessage('File URL is required')
      .trim(),
    body('fileType')
      .optional()
      .isIn(['image', 'document', 'spreadsheet', 'presentation', 'other'])
      .withMessage('Invalid file type')
  ],
  projectController.addDocument
);

module.exports = router;