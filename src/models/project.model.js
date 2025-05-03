/**
 * Project Model (Client-side)
 * 
 * This is a mirror of the server-side model, used for TypeScript typing
 * and client-side validation.
 */

/**
 * @typedef {Object} Task
 * @property {string} _id - Task ID
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} status - Task status (todo, in_progress, review, completed)
 * @property {string} priority - Task priority (low, medium, high, urgent)
 * @property {string} dueDate - Task due date
 * @property {string[]} assignees - IDs of users assigned to the task
 * @property {object} progress - Task progress information
 * @property {number} progress.percentage - Percentage of task completion (0-100)
 * @property {string} progress.lastUpdated - Date when progress was last updated
 * @property {object[]} comments - Comments on the task
 * @property {string} comments.text - Comment text
 * @property {string} comments.createdBy - ID of user who created the comment
 * @property {string} comments.createdAt - Date when comment was created
 * @property {object[]} attachments - Task attachments
 * @property {string} attachments.name - Attachment name
 * @property {string} attachments.fileUrl - URL to the attachment file
 * @property {string} attachments.uploadedBy - ID of user who uploaded the attachment
 * @property {string} attachments.uploadedAt - Date when attachment was uploaded
 * @property {string[]} tags - Task tags
 * @property {string} createdBy - ID of user who created the task
 * @property {string} createdAt - Date when task was created
 * @property {string} updatedAt - Date when task was last updated
 */

/**
 * @typedef {Object} Milestone
 * @property {string} _id - Milestone ID
 * @property {string} title - Milestone title
 * @property {string} description - Milestone description
 * @property {string} status - Milestone status (pending, completed)
 * @property {string} dueDate - Milestone due date
 * @property {Task[]} tasks - Tasks associated with the milestone
 * @property {string} createdBy - ID of user who created the milestone
 * @property {string} createdAt - Date when milestone was created
 * @property {string} updatedAt - Date when milestone was last updated
 */

/**
 * @typedef {Object} Resource
 * @property {string} _id - Resource ID
 * @property {string} type - Resource type (human, material, equipment)
 * @property {string} name - Resource name
 * @property {string} description - Resource description
 * @property {object} availability - Resource availability
 * @property {boolean} availability.isAvailable - Is resource available
 * @property {string[]} availability.assignedTo - IDs of projects resource is assigned to
 * @property {number} cost - Resource cost
 * @property {string} unit - Unit of measurement (hour, day, piece)
 * @property {object} contact - Contact information for the resource
 * @property {string} contact.name - Contact name
 * @property {string} contact.email - Contact email
 * @property {string} contact.phone - Contact phone
 * @property {string} createdBy - ID of user who created the resource
 * @property {string} createdAt - Date when resource was created
 * @property {string} updatedAt - Date when resource was last updated
 */

/**
 * @typedef {Object} Risk
 * @property {string} _id - Risk ID
 * @property {string} title - Risk title
 * @property {string} description - Risk description
 * @property {string} impact - Risk impact (low, medium, high)
 * @property {string} probability - Risk probability (low, medium, high)
 * @property {string} status - Risk status (active, mitigated, occurred)
 * @property {string} mitigationPlan - Risk mitigation plan
 * @property {string} contingencyPlan - Risk contingency plan
 * @property {string} owner - ID of user who owns the risk
 * @property {string} createdBy - ID of user who created the risk
 * @property {string} createdAt - Date when risk was created
 * @property {string} updatedAt - Date when risk was last updated
 */

/**
 * @typedef {Object} Project
 * @property {string} _id - Project ID
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string} status - Project status (planning, active, on_hold, completed, cancelled)
 * @property {string} type - Project type (residential, commercial, mixed_use)
 * @property {string} priority - Project priority (low, medium, high)
 * @property {object} dates - Project dates
 * @property {string} dates.startDate - Project start date
 * @property {string} dates.endDate - Project end date (target)
 * @property {string} dates.actualEndDate - Project actual end date
 * @property {object} location - Project location
 * @property {string} location.address - Project address
 * @property {string} location.city - Project city
 * @property {string} location.state - Project state
 * @property {string} location.country - Project country
 * @property {object} client - Client information
 * @property {string} client.name - Client name
 * @property {string} client.contactPerson - Client contact person
 * @property {string} client.email - Client email
 * @property {string} client.phone - Client phone
 * @property {object} budget - Project budget
 * @property {number} budget.estimated - Estimated budget
 * @property {number} budget.actual - Actual budget spent
 * @property {string} budget.currency - Budget currency
 * @property {object} progress - Project progress
 * @property {number} progress.percentage - Percentage of project completion (0-100)
 * @property {string} progress.lastUpdated - Date when progress was last updated
 * @property {object} team - Project team
 * @property {string} team.manager - ID of project manager
 * @property {string[]} team.members - IDs of team members
 * @property {Milestone[]} milestones - Project milestones
 * @property {Task[]} tasks - Project tasks
 * @property {Resource[]} resources - Project resources
 * @property {Risk[]} risks - Project risks
 * @property {object[]} documents - Project documents
 * @property {string} documents.name - Document name
 * @property {string} documents.fileUrl - URL to the document file
 * @property {string} documents.category - Document category
 * @property {string} documents.uploadedBy - ID of user who uploaded the document
 * @property {string} documents.uploadedAt - Date when document was uploaded
 * @property {string[]} tags - Project tags
 * @property {string} createdBy - ID of user who created the project
 * @property {string} createdAt - Date when project was created
 * @property {string} updatedAt - Date when project was last updated
 */

// Export model types for TypeScript
export const ProjectModel = {
  // Project status options
  STATUS: {
    PLANNING: 'planning',
    ACTIVE: 'active',
    ON_HOLD: 'on_hold',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  // Project type options
  TYPE: {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    MIXED_USE: 'mixed_use'
  },
  
  // Priority options
  PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  },
  
  // Task status options
  TASK_STATUS: {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    REVIEW: 'review',
    COMPLETED: 'completed'
  },
  
  // Resource type options
  RESOURCE_TYPE: {
    HUMAN: 'human',
    MATERIAL: 'material',
    EQUIPMENT: 'equipment'
  },
  
  // Risk impact options
  RISK_IMPACT: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  }
};