/**
 * Project Test Data Generator
 * Utility to generate test data for the project management system
 */

// Generate random date within past X days
const randomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Generate future date within next X days
const randomFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date.toISOString();
};

// Generate random name
const randomName = () => {
  const firstNames = ['Raj', 'Priya', 'Ajay', 'Neha', 'Vikram', 'Ananya', 'Sanjay', 'Pooja', 'Rahul', 'Divya'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Joshi', 'Gupta', 'Mehta', 'Verma', 'Rao'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate random email
const randomEmail = (name) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com'];
  const nameParts = name.toLowerCase().split(' ');
  const email = `${nameParts[0]}.${nameParts[1]}@${domains[Math.floor(Math.random() * domains.length)]}`;
  return email;
};

// Generate random phone number
const randomPhone = () => {
  return `+91 ${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
};

// Generate random area
const randomArea = () => {
  const areas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kukatpally', 'HITEC City', 'Kondapur', 'Miyapur', 'Manikonda', 'Narsingi'];
  return areas[Math.floor(Math.random() * areas.length)];
};

// Generate random user
const randomUser = (userId) => {
  const name = randomName();
  const nameParts = name.split(' ');
  
  return {
    _id: userId || `user_${Math.floor(Math.random() * 1000)}`,
    firstName: nameParts[0],
    lastName: nameParts[1],
    email: randomEmail(name)
  };
};

// Generate random project status
const randomProjectStatus = () => {
  const statuses = ['planning', 'inProgress', 'onHold', 'completed', 'canceled'];
  const weights = [3, 5, 2, 3, 1]; // Weighted distribution
  
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < statuses.length; i++) {
    random -= weights[i];
    if (random <= 0) return statuses[i];
  }
  
  return statuses[0];
};

// Generate random task status
const randomTaskStatus = () => {
  const statuses = ['todo', 'inProgress', 'review', 'done'];
  const weights = [4, 5, 2, 3]; // Weighted distribution
  
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < statuses.length; i++) {
    random -= weights[i];
    if (random <= 0) return statuses[i];
  }
  
  return statuses[0];
};

// Generate random progress (0-100)
const randomProgress = () => {
  return Math.floor(Math.random() * 101);
};

// Generate random budget
const randomBudget = () => {
  const total = Math.floor(Math.random() * 90000000) + 10000000; // 1-10 crore
  return {
    total,
    spent: Math.floor(Math.random() * total),
    currency: 'INR'
  };
};

// Generate random property type
const randomPropertyType = () => {
  const types = ['residential', 'commercial', 'mixed', 'land'];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate random priority
const randomPriority = () => {
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const weights = [2, 5, 3, 1]; // Weighted distribution
  
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < priorities.length; i++) {
    random -= weights[i];
    if (random <= 0) return priorities[i];
  }
  
  return priorities[1]; // Default to medium
};

// Generate random task name
const randomTaskName = () => {
  const taskPrefixes = [
    'Design', 'Develop', 'Create', 'Update', 'Review', 'Analyze', 
    'Implement', 'Test', 'Deploy', 'Optimize', 'Draft', 'Finalize'
  ];
  
  const taskObjects = [
    'Site plan', 'Floor layout', 'Electrical system', 'Plumbing', 'Foundation', 
    'Structural design', 'Interior design', 'Landscaping', 'Security system', 
    'Ventilation', 'Pricing model', 'Marketing materials', 'Legal documents',
    'Permit application', 'Budget projection', 'Construction timeline'
  ];
  
  return `${taskPrefixes[Math.floor(Math.random() * taskPrefixes.length)]} ${taskObjects[Math.floor(Math.random() * taskObjects.length)]}`;
};

// Generate random task description
const randomTaskDescription = (taskName) => {
  const descriptions = [
    `Complete the ${taskName.toLowerCase()} according to the project specifications.`,
    `Finalize the ${taskName.toLowerCase()} and get approval from the client.`,
    `Review the existing ${taskName.toLowerCase()} and make necessary improvements.`,
    `Coordinate with the team to ensure timely completion of the ${taskName.toLowerCase()}.`,
    `Prepare documentation for the ${taskName.toLowerCase()} for future reference.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Generate random comments
const generateComments = (count, users) => {
  const comments = [];
  const commentTexts = [
    'Looking good! Let\'s proceed with this.',
    'I have some concerns about the timeline.',
    'Can we discuss this in the next meeting?',
    'I\'ve updated the documents as requested.',
    'This looks promising. Keep up the good work!',
    'We need to reconsider our approach here.',
    'The client has approved this stage.',
    'Let\'s schedule a site visit to verify this.',
    'The budget estimate seems off. Can we review?',
    'I\'ve added the necessary details to the specification.'
  ];
  
  for (let i = 0; i < count; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    comments.push({
      _id: `comment_${Math.floor(Math.random() * 1000)}`,
      text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      author,
      createdAt: randomDate(30)
    });
  }
  
  return comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// Generate random documents
const generateDocuments = (count, users) => {
  const documents = [];
  const documentNames = [
    'Site Plan', 'Floor Layout', 'Electrical Diagram', 'Plumbing Diagram',
    'Construction Contract', 'Client Agreement', 'Budget Projection',
    'Design Specification', 'Marketing Brochure', 'Legal Compliance Report',
    'Environmental Assessment', 'Structural Analysis', 'Project Timeline',
    'Material Specification', 'Quality Assurance Plan', 'Safety Protocol'
  ];
  
  const fileTypes = ['document', 'spreadsheet', 'presentation', 'image'];
  
  for (let i = 0; i < count; i++) {
    const uploadedBy = users[Math.floor(Math.random() * users.length)];
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const extension = fileType === 'document' ? '.pdf' : 
                      fileType === 'spreadsheet' ? '.xlsx' : 
                      fileType === 'presentation' ? '.pptx' : '.jpg';
    
    documents.push({
      _id: `document_${Math.floor(Math.random() * 1000)}`,
      name: documentNames[Math.floor(Math.random() * documentNames.length)],
      fileUrl: `https://example.com/documents/project_${Math.floor(Math.random() * 100)}${extension}`,
      fileType,
      uploadedBy,
      uploadedAt: randomDate(60)
    });
  }
  
  return documents.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
};

// Generate random tasks
export const generateTasksData = (count) => {
  const tasks = [];
  
  for (let i = 0; i < count; i++) {
    const taskName = randomTaskName();
    const status = randomTaskStatus();
    const startDate = randomDate(60);
    const dueDate = randomFutureDate(90);
    
    // Calculate completedAt based on status
    let completedAt = null;
    if (status === 'done') {
      completedAt = new Date(dueDate);
      completedAt.setDate(completedAt.getDate() - Math.floor(Math.random() * 14)); // Completed 0-14 days before due date
      completedAt = completedAt.toISOString();
    }
    
    tasks.push({
      _id: `task_${Math.floor(Math.random() * 1000)}`,
      name: taskName,
      description: randomTaskDescription(taskName),
      assignedTo: randomUser(),
      startDate,
      dueDate,
      status,
      priority: randomPriority(),
      completedAt,
      createdAt: startDate,
      updatedAt: status === 'done' ? completedAt : new Date().toISOString()
    });
  }
  
  return tasks;
};

// Generate a full project
export const generateProjectsData = (count) => {
  const projects = [];
  
  for (let i = 0; i < count; i++) {
    // Generate team members (3-6 users)
    const teamSize = Math.floor(Math.random() * 4) + 3;
    const team = [];
    
    for (let j = 0; j < teamSize; j++) {
      team.push(randomUser(`user_${j + 1}`));
    }
    
    // Generate manager (from the team)
    const manager = team[Math.floor(Math.random() * team.length)];
    
    // Generate tasks (4-8 tasks)
    const taskCount = Math.floor(Math.random() * 5) + 4;
    const tasks = generateTasksData(taskCount);
    
    // Set project dates
    const startDate = randomDate(180); // Up to 6 months ago
    const endDate = randomFutureDate(365); // Up to 1 year in the future
    
    // Calculate project progress based on task status
    let progress = 0;
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      const inProgressTasks = tasks.filter(task => task.status === 'inProgress' || task.status === 'review').length;
      
      progress = Math.round((completedTasks / tasks.length) * 100);
      
      // Add partial progress for in-progress tasks
      if (inProgressTasks > 0) {
        progress += Math.round((inProgressTasks / tasks.length) * 30); // Count in-progress as 30% done
      }
      
      // Cap at 100%
      progress = Math.min(progress, 100);
    }
    
    // Create project
    const project = {
      _id: `project_${i}`,
      name: `${randomArea()} ${randomPropertyType().charAt(0).toUpperCase() + randomPropertyType().slice(1)} Project`,
      description: `A premium ${randomPropertyType()} development located in ${randomArea()}, Hyderabad. This project features modern design, quality construction, and strategic location advantages.`,
      location: {
        area: randomArea(),
        city: 'Hyderabad',
        coordinates: [
          78.3 + Math.random() * 0.5, // Longitude
          17.3 + Math.random() * 0.5  // Latitude
        ]
      },
      propertyType: randomPropertyType(),
      startDate,
      endDate,
      status: randomProjectStatus(),
      progress,
      budget: randomBudget(),
      manager,
      team,
      tasks,
      comments: generateComments(Math.floor(Math.random() * 5) + 1, team),
      documents: generateDocuments(Math.floor(Math.random() * 4) + 1, team),
      createdBy: team[0],
      createdAt: startDate,
      updatedAt: new Date().toISOString()
    };
    
    projects.push(project);
  }
  
  return projects;
};

// Generate project statistics
export const generateProjectStats = () => {
  // Status stats
  const statusStats = [
    { _id: 'planning', count: Math.floor(Math.random() * 5) + 2 },
    { _id: 'inProgress', count: Math.floor(Math.random() * 10) + 5 },
    { _id: 'onHold', count: Math.floor(Math.random() * 3) + 1 },
    { _id: 'completed', count: Math.floor(Math.random() * 8) + 2 },
    { _id: 'canceled', count: Math.floor(Math.random() * 2) + 1 }
  ];
  
  // Type stats
  const typeStats = [
    { _id: 'residential', count: Math.floor(Math.random() * 15) + 5 },
    { _id: 'commercial', count: Math.floor(Math.random() * 10) + 2 },
    { _id: 'mixed', count: Math.floor(Math.random() * 5) + 1 },
    { _id: 'land', count: Math.floor(Math.random() * 3) + 1 }
  ];
  
  // Budget stats
  const totalBudget = (Math.floor(Math.random() * 5) + 10) * 100000000; // 10-15 crore
  const totalSpent = Math.floor(totalBudget * (Math.random() * 0.8 + 0.1)); // 10-90% of total
  
  const budgetStats = {
    totalBudget,
    totalSpent
  };
  
  // Duration stats
  const averageDuration = Math.floor(Math.random() * 180) + 180; // 180-360 days
  
  const durationStats = {
    averageDuration
  };
  
  // Task stats
  const taskStats = [
    { _id: 'todo', count: Math.floor(Math.random() * 20) + 10 },
    { _id: 'inProgress', count: Math.floor(Math.random() * 15) + 5 },
    { _id: 'review', count: Math.floor(Math.random() * 10) + 2 },
    { _id: 'done', count: Math.floor(Math.random() * 40) + 20 }
  ];
  
  return {
    statusStats,
    typeStats,
    budgetStats,
    durationStats,
    taskStats
  };
};

// Export default data object for mock services
export default {
  generateProjectsData,
  generateTasksData,
  generateProjectStats
};