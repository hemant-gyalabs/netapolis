/**
 * Project Model
 * Handles real estate projects and their details
 */

const mongoose = require('mongoose');

// Task Schema (embedded document)
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Comment Schema (embedded document)
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Document Schema (embedded document)
const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    enum: ['image', 'document', 'spreadsheet', 'presentation', 'other'],
    default: 'document'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    area: {
      type: String,
      required: [true, 'Project area is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Project city is required'],
      trim: true,
      default: 'Hyderabad'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function(val) {
          return val.length === 2;
        },
        message: 'Coordinates must contain longitude and latitude'
      }
    }
  },
  propertyType: {
    type: String,
    enum: ['residential', 'commercial', 'mixed', 'land'],
    required: [true, 'Property type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['planning', 'inProgress', 'onHold', 'completed', 'canceled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    total: {
      type: Number,
      required: [true, 'Total budget is required']
    },
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project manager is required']
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: [taskSchema],
  documents: [documentSchema],
  comments: [commentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for completed tasks percentage
projectSchema.virtual('completedTasksPercentage').get(function() {
  if (this.tasks.length === 0) return 0;
  
  const completedTasks = this.tasks.filter(task => task.status === 'done').length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Virtual property for days left
projectSchema.virtual('daysLeft').get(function() {
  const today = new Date();
  const endDate = new Date(this.endDate);
  
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual property for budget utilization percentage
projectSchema.virtual('budgetUtilization').get(function() {
  if (this.budget.total === 0) return 0;
  return Math.round((this.budget.spent / this.budget.total) * 100);
});

// Index for faster querying
projectSchema.index({ name: 1 });
projectSchema.index({ 'location.area': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ manager: 1 });

// Auto-update the updatedAt timestamp
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-calculate progress based on completed tasks
projectSchema.pre('save', function(next) {
  if (this.tasks.length > 0) {
    const completedTasks = this.tasks.filter(task => task.status === 'done').length;
    this.progress = Math.round((completedTasks / this.tasks.length) * 100);
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;