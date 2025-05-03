/**
 * Project Service
 * Handles API calls for project management functionality
 */

import { api } from './api.service';
import { generateProjectsData, generateTasksData, generateProjectStats } from '../utils/projectTestData';

// Mock implementation using test data
const useMockData = true;

export const projectService = {
  /**
   * Get all projects with filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  async getAllProjects(params = {}) {
    try {
      if (useMockData) {
        // Generate mock projects
        const projects = generateProjectsData(15);
        
        // Apply filtering (simple implementation)
        let filteredProjects = [...projects];
        
        // Apply status filter
        if (params.status) {
          filteredProjects = filteredProjects.filter(project => 
            project.status === params.status
          );
        }
        
        // Apply property type filter
        if (params.propertyType) {
          filteredProjects = filteredProjects.filter(project => 
            project.propertyType === params.propertyType
          );
        }
        
        // Apply manager filter
        if (params.manager) {
          filteredProjects = filteredProjects.filter(project => 
            project.manager._id === params.manager
          );
        }
        
        // Sort (simple implementation)
        if (params.sortBy) {
          filteredProjects.sort((a, b) => {
            const valueA = a[params.sortBy];
            const valueB = b[params.sortBy];
            
            if (params.sortBy === 'name') {
              return params.sortOrder === 'desc' 
                ? valueB.localeCompare(valueA) 
                : valueA.localeCompare(valueB);
            }
            
            return params.sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
          });
        } else {
          // Default sort by createdAt desc
          filteredProjects.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
        }
        
        // Paginate
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
        
        // Create response
        return {
          status: 'success',
          data: {
            projects: paginatedProjects
          },
          pagination: {
            total: filteredProjects.length,
            page,
            limit,
            pages: Math.ceil(filteredProjects.length / limit)
          }
        };
      }
      
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get project by ID
   * @param {String} id - Project ID
   * @returns {Promise} - API response
   */
  async getProjectById(id) {
    try {
      if (useMockData) {
        // Generate a project with the given ID
        const projects = generateProjectsData(1);
        projects[0]._id = id;
        
        return {
          status: 'success',
          data: {
            project: projects[0]
          }
        };
      }
      
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise} - API response
   */
  async createProject(projectData) {
    try {
      if (useMockData) {
        // Generate a new project based on the provided data
        const project = {
          _id: `project_${Math.floor(Math.random() * 1000)}`,
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            project
          }
        };
      }
      
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update a project
   * @param {String} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} - API response
   */
  async updateProject(id, projectData) {
    try {
      if (useMockData) {
        // Generate an updated project
        const projects = generateProjectsData(1);
        const updatedProject = {
          ...projects[0],
          _id: id,
          ...projectData,
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            project: updatedProject
          }
        };
      }
      
      const response = await api.patch(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Delete a project
   * @param {String} id - Project ID
   * @returns {Promise} - API response
   */
  async deleteProject(id) {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: null
        };
      }
      
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Add a task to a project
   * @param {String} projectId - Project ID
   * @param {Object} taskData - Task data
   * @returns {Promise} - API response
   */
  async addTask(projectId, taskData) {
    try {
      if (useMockData) {
        // Generate a new task
        const tasks = generateTasksData(1);
        const task = {
          ...tasks[0],
          ...taskData,
          _id: `task_${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            task
          }
        };
      }
      
      const response = await api.post(`/projects/${projectId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update a task
   * @param {String} projectId - Project ID
   * @param {String} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} - API response
   */
  async updateTask(projectId, taskId, taskData) {
    try {
      if (useMockData) {
        // Generate an updated task
        const tasks = generateTasksData(1);
        const task = {
          ...tasks[0],
          _id: taskId,
          ...taskData,
          updatedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            task
          }
        };
      }
      
      const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Delete a task
   * @param {String} projectId - Project ID
   * @param {String} taskId - Task ID
   * @returns {Promise} - API response
   */
  async deleteTask(projectId, taskId) {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: null
        };
      }
      
      const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Add a comment to a project
   * @param {String} projectId - Project ID
   * @param {String} text - Comment text
   * @returns {Promise} - API response
   */
  async addComment(projectId, text) {
    try {
      if (useMockData) {
        // Generate a new comment
        const comment = {
          _id: `comment_${Math.floor(Math.random() * 1000)}`,
          text,
          author: {
            _id: 'user_1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          createdAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            comment
          }
        };
      }
      
      const response = await api.post(`/projects/${projectId}/comments`, { text });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Add a document to a project
   * @param {String} projectId - Project ID
   * @param {Object} documentData - Document data
   * @returns {Promise} - API response
   */
  async addDocument(projectId, documentData) {
    try {
      if (useMockData) {
        // Generate a new document
        const document = {
          _id: `document_${Math.floor(Math.random() * 1000)}`,
          ...documentData,
          uploadedBy: {
            _id: 'user_1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          uploadedAt: new Date().toISOString()
        };
        
        return {
          status: 'success',
          data: {
            document
          }
        };
      }
      
      const response = await api.post(`/projects/${projectId}/documents`, documentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get project statistics
   * @returns {Promise} - API response
   */
  async getProjectStats() {
    try {
      if (useMockData) {
        return {
          status: 'success',
          data: generateProjectStats()
        };
      }
      
      const response = await api.get('/projects/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get user's assigned tasks across all projects
   * @returns {Promise} - API response
   */
  async getMyTasks() {
    try {
      if (useMockData) {
        // Generate tasks for the current user
        const tasks = generateTasksData(10);
        
        // Add project info to each task
        tasks.forEach(task => {
          task.projectId = `project_${Math.floor(Math.random() * 10)}`;
          task.projectName = `Project ${Math.floor(Math.random() * 10) + 1}`;
        });
        
        return {
          status: 'success',
          results: tasks.length,
          data: {
            tasks
          }
        };
      }
      
      const response = await api.get('/projects/my-tasks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create test projects (for development only)
   * @returns {Promise} - API response
   */
  async createTestProjects() {
    try {
      if (useMockData) {
        return {
          status: 'success',
          message: '10 test projects created successfully',
          data: {
            count: 10
          }
        };
      }
      
      const response = await api.post('/projects/test-data');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Search projects
   * @param {String} query - Search query
   * @returns {Promise} - API response
   */
  async searchProjects(query) {
    try {
      if (useMockData) {
        // Generate projects and filter by the query
        const allProjects = generateProjectsData(20);
        const projects = allProjects.filter(project => 
          project.name.toLowerCase().includes(query.toLowerCase()) ||
          (project.description && project.description.toLowerCase().includes(query.toLowerCase())) ||
          project.location.area.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
          status: 'success',
          results: projects.length,
          data: {
            projects: projects.slice(0, 10)
          }
        };
      }
      
      const response = await api.get('/projects/search', { params: { query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};