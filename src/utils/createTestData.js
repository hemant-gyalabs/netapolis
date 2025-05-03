/**
 * Create Test Data Script
 * 
 * This script creates test data for development and testing purposes.
 * It populates the database with sample projects, tasks, and users.
 */
import { projectService } from '../services/project.service';
import { userService } from '../services/user.service';

/**
 * Create test projects
 * @returns {Promise} - Response after creating test projects
 */
export const createTestProjects = async () => {
  try {
    const response = await projectService.createTestProjects();
    return response;
  } catch (error) {
    console.error('Error creating test projects:', error);
    throw error;
  }
};

/**
 * Initialize dashboard data
 * Creates test data for the dashboard if none exists
 * @returns {Promise} - Response after initializing data
 */
export const initializeDashboardData = async () => {
  try {
    // Check if projects exist
    const projectsResponse = await projectService.getAllProjects({
      limit: 1
    });

    // If no projects exist, create test data
    if (projectsResponse.data.projects.length === 0) {
      console.log('No projects found. Creating test data...');
      await createTestProjects();
      console.log('Test data created successfully!');
    } else {
      console.log('Projects already exist. Skipping test data creation.');
    }

    return {
      status: 'success',
      message: 'Dashboard data initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing dashboard data:', error);
    throw error;
  }
};

/**
 * Main function to create all test data
 * @returns {Promise} - Response after creating test data
 */
export const createAllTestData = async () => {
  try {
    // Initialize dashboard data
    await initializeDashboardData();

    return {
      status: 'success',
      message: 'All test data created successfully'
    };
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
};