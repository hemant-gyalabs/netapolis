/**
 * Project Controller
 * Handles API requests related to real estate projects and tasks
 */

const { validationResult } = require('express-validator');
const Project = require('../models/project.model');
const User = require('../models/user.model');

/**
 * Get all projects with filtering
 * GET /api/projects
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    // Extract query parameters
    const {
      status,
      propertyType,
      manager,
      team,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    if (manager) query.manager = manager;
    if (team) query.team = team;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const projects = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('manager', 'firstName lastName email')
      .populate('team', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email');
    
    // Count total documents
    const total = await Project.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: projects.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'firstName lastName email')
      .populate('team', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('tasks.assignedTo', 'firstName lastName email')
      .populate('comments.author', 'firstName lastName email')
      .populate('documents.uploadedBy', 'firstName lastName email');
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new project
 * POST /api/projects
 */
exports.createProject = async (req, res, next) => {
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
    
    // Create the project
    const newProject = await Project.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        project: newProject
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a project
 * PATCH /api/projects/:id
 */
exports.updateProject = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find and update the project
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run validation on update
      }
    )
    .populate('manager', 'firstName lastName email')
    .populate('team', 'firstName lastName email');
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
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
 * Add a task to a project
 * POST /api/projects/:id/tasks
 */
exports.addTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find the project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Add the task
    project.tasks.push({
      ...req.body,
      updatedAt: Date.now()
    });
    
    // Save the project
    await project.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        task: project.tasks[project.tasks.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task
 * PATCH /api/projects/:id/tasks/:taskId
 */
exports.updateTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find the project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Find the task
    const taskIndex = project.tasks.findIndex(
      task => task._id.toString() === req.params.taskId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Update the task
    Object.keys(req.body).forEach(key => {
      project.tasks[taskIndex][key] = req.body[key];
    });
    
    // Update timestamp
    project.tasks[taskIndex].updatedAt = Date.now();
    
    // If status is 'done', set completedAt
    if (req.body.status === 'done' && !project.tasks[taskIndex].completedAt) {
      project.tasks[taskIndex].completedAt = Date.now();
    }
    
    // Save the project
    await project.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        task: project.tasks[taskIndex]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 * DELETE /api/projects/:id/tasks/:taskId
 */
exports.deleteTask = async (req, res, next) => {
  try {
    // Find the project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Find the task
    const taskIndex = project.tasks.findIndex(
      task => task._id.toString() === req.params.taskId
    );
    
    if (taskIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    // Remove the task
    project.tasks.splice(taskIndex, 1);
    
    // Save the project
    await project.save();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a comment to a project
 * POST /api/projects/:id/comments
 */
exports.addComment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find the project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Add the comment
    project.comments.push({
      text: req.body.text,
      author: req.user.id
    });
    
    // Save the project
    await project.save();
    
    // Populate the author
    const populatedProject = await Project.findById(req.params.id)
      .populate('comments.author', 'firstName lastName email');
    
    res.status(201).json({
      status: 'success',
      data: {
        comment: populatedProject.comments[populatedProject.comments.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a document to a project
 * POST /api/projects/:id/documents
 */
exports.addDocument = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    
    // Find the project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Add the document
    project.documents.push({
      ...req.body,
      uploadedBy: req.user.id
    });
    
    // Save the project
    await project.save();
    
    // Populate the uploadedBy
    const populatedProject = await Project.findById(req.params.id)
      .populate('documents.uploadedBy', 'firstName lastName email');
    
    res.status(201).json({
      status: 'success',
      data: {
        document: populatedProject.documents[populatedProject.documents.length - 1]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project statistics
 * GET /api/projects/stats
 */
exports.getProjectStats = async (req, res, next) => {
  try {
    // Get counts by status
    const statusStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get counts by property type
    const typeStats = await Project.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get total budget and spent
    const budgetStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget.total' },
          totalSpent: { $sum: '$budget.spent' }
        }
      }
    ]);
    
    // Get average project duration in days
    const durationStats = await Project.aggregate([
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$endDate', '$startDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageDuration: { $avg: '$duration' }
        }
      }
    ]);
    
    // Get task completion stats
    const taskStats = await Project.aggregate([
      {
        $unwind: '$tasks'
      },
      {
        $group: {
          _id: '$tasks.status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        statusStats,
        typeStats,
        budgetStats: budgetStats[0] || { totalBudget: 0, totalSpent: 0 },
        durationStats: durationStats[0] || { averageDuration: 0 },
        taskStats
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's assigned tasks across all projects
 * GET /api/projects/my-tasks
 */
exports.getMyTasks = async (req, res, next) => {
  try {
    // Find all projects with tasks assigned to the user
    const projects = await Project.find({
      'tasks.assignedTo': req.user.id
    });
    
    // Extract the tasks
    const tasks = [];
    
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.assignedTo && task.assignedTo.toString() === req.user.id) {
          tasks.push({
            ...task.toObject(),
            projectId: project._id,
            projectName: project.name
          });
        }
      });
    });
    
    // Sort tasks by due date
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create test projects (for development only)
 * POST /api/projects/test-data
 */
exports.createTestProjects = async (req, res, next) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        status: 'error',
        message: 'This endpoint is only available in development environment'
      });
    }
    
    // Get users for assignment
    const users = await User.find();
    
    if (users.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'At least 2 users are required to create test projects'
      });
    }
    
    // Sample data
    const areas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'HITEC City'];
    const propertyTypes = ['residential', 'commercial', 'mixed', 'land'];
    const statuses = ['planning', 'inProgress', 'onHold', 'completed'];
    const taskNames = [
      'Site Analysis', 'Design Development', 'Permit Application', 
      'Foundation Work', 'Structural Work', 'Electrical Installation',
      'Plumbing Work', 'Interior Finishing', 'Landscaping',
      'Quality Inspection', 'Client Approval', 'Handover'
    ];
    const taskStatuses = ['todo', 'inProgress', 'review', 'done'];
    
    // Create projects
    const projects = [];
    
    for (let i = 0; i < 10; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 180) + 90);
      
      const manager = users[Math.floor(Math.random() * users.length)];
      
      // Create team (1-3 members, excluding manager)
      const teamSize = Math.floor(Math.random() * 3) + 1;
      const team = [];
      
      while (team.length < teamSize) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        if (
          randomUser._id.toString() !== manager._id.toString() &&
          !team.some(member => member.toString() === randomUser._id.toString())
        ) {
          team.push(randomUser._id);
        }
      }
      
      // Create tasks (3-6 tasks)
      const taskCount = Math.floor(Math.random() * 4) + 3;
      const tasks = [];
      
      for (let j = 0; j < taskCount; j++) {
        const taskStartDate = new Date(startDate);
        taskStartDate.setDate(taskStartDate.getDate() + Math.floor(Math.random() * 30));
        
        const taskDueDate = new Date(taskStartDate);
        taskDueDate.setDate(taskDueDate.getDate() + Math.floor(Math.random() * 30) + 7);
        
        const taskStatus = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
        
        const task = {
          name: taskNames[Math.floor(Math.random() * taskNames.length)],
          description: `This is a test task for project ${i + 1}`,
          assignedTo: team[Math.floor(Math.random() * team.length)],
          startDate: taskStartDate,
          dueDate: taskDueDate,
          status: taskStatus,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          completedAt: taskStatus === 'done' ? new Date() : undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        tasks.push(task);
      }
      
      // Create project
      const project = {
        name: `Test Project ${i + 1}`,
        description: `This is a test project description for project ${i + 1}`,
        location: {
          area: areas[Math.floor(Math.random() * areas.length)],
          city: 'Hyderabad',
          coordinates: [
            78.3 + Math.random() * 0.5, // Longitude
            17.3 + Math.random() * 0.5  // Latitude
          ]
        },
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        startDate,
        endDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        budget: {
          total: Math.floor(Math.random() * 50000000) + 10000000, // 1-6 crore
          spent: Math.floor(Math.random() * 30000000),
          currency: 'INR'
        },
        manager: manager._id,
        team,
        tasks,
        createdBy: users[0]._id, // First user as creator
        createdAt: new Date(startDate),
        updatedAt: new Date()
      };
      
      projects.push(project);
    }
    
    // Clear existing projects (optional)
    await Project.deleteMany({});
    
    // Insert projects
    await Project.insertMany(projects);
    
    res.status(201).json({
      status: 'success',
      message: `${projects.length} test projects created successfully`,
      data: {
        count: projects.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search projects
 * GET /api/projects/search
 */
exports.searchProjects = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }
    
    const projects = await Project.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.area': { $regex: query, $options: 'i' } }
      ]
    })
    .limit(10)
    .populate('manager', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};