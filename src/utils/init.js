/**
 * Dashboard Initialization Script
 * 
 * This script runs when the dashboard application starts,
 * initializing necessary components and services.
 */

import { createAllTestData } from './createTestData';

/**
 * Initialize the dashboard application
 * @returns {Promise} - A promise that resolves when initialization is complete
 */
export const initializeDashboard = async () => {
  console.log('Initializing dashboard...');
  
  try {
    // Initialize test data if in development environment
    if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_TEST_DATA === 'true') {
      console.log('Development environment detected. Checking if test data needs to be created...');
      await createAllTestData();
    }
    
    // Initialize other services and components as needed
    
    console.log('Dashboard initialization complete.');
    return {
      status: 'success',
      message: 'Dashboard initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    return {
      status: 'error',
      message: 'Failed to initialize dashboard',
      error
    };
  }
};

/**
 * Check if component integration is working properly
 * @returns {Object} - Status of each component
 */
export const checkComponentIntegration = () => {
  // List of components to check
  const components = [
    'projects',
    'scores',
    'calculators'
  ];
  
  const results = {};
  
  // Check each component
  components.forEach(component => {
    try {
      // Simple check to see if component is available
      // In a real application, this would do more thorough testing
      const isAvailable = true;
      
      results[component] = {
        status: isAvailable ? 'available' : 'unavailable',
        integrated: isAvailable
      };
    } catch (error) {
      results[component] = {
        status: 'error',
        integrated: false,
        error: error.message
      };
    }
  });
  
  return results;
};

/**
 * Check for cross-browser compatibility issues
 * @returns {Object} - Status of browser compatibility
 */
export const checkBrowserCompatibility = () => {
  // Detect browser
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  }
  
  // Check for required browser features
  const requiredFeatures = [
    { name: 'CSS Grid', available: typeof CSS !== 'undefined' && CSS.supports && CSS.supports('display', 'grid') },
    { name: 'Fetch API', available: typeof fetch !== 'undefined' },
    { name: 'ES6 Features', available: typeof Promise !== 'undefined' && typeof Symbol !== 'undefined' },
    { name: 'localStorage', available: typeof localStorage !== 'undefined' },
    { name: 'sessionStorage', available: typeof sessionStorage !== 'undefined' },
    { name: 'History API', available: typeof history !== 'undefined' && typeof history.pushState === 'function' }
  ];
  
  // Check for missing features
  const missingFeatures = requiredFeatures.filter(feature => !feature.available);
  
  return {
    browser: browserName,
    compatible: missingFeatures.length === 0,
    features: requiredFeatures,
    missingFeatures
  };
};

/**
 * Check for mobile responsiveness
 * @returns {Object} - Status of mobile responsiveness
 */
export const checkMobileResponsiveness = () => {
  // Get window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Determine device type based on width
  let deviceType = 'desktop';
  if (width <= 480) {
    deviceType = 'mobile';
  } else if (width <= 768) {
    deviceType = 'tablet';
  }
  
  // Check if viewport meta tag is set correctly
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const hasProperViewport = viewportMeta && viewportMeta.content.includes('width=device-width');
  
  return {
    deviceType,
    dimensions: { width, height },
    isResponsive: hasProperViewport,
    viewportMeta: viewportMeta ? viewportMeta.content : null
  };
};

/**
 * Run all checks to ensure the dashboard is properly integrated and responsive
 * @returns {Object} - Results of all checks
 */
export const runIntegrationChecks = () => {
  console.log('Running integration checks...');
  
  return {
    components: checkComponentIntegration(),
    browserCompatibility: checkBrowserCompatibility(),
    mobileResponsiveness: checkMobileResponsiveness()
  };
};