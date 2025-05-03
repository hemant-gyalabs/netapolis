/**
 * Integration Module
 * 
 * This module handles the integration between different components of the Neopolis Dashboard
 * including projects, scores, calculators, and the main website.
 */

// Component communication handlers
const componentBridge = {
  // Event listeners for cross-component communication
  listeners: {},
  
  // Register an event listener
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  },
  
  // Remove an event listener
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },
  
  // Trigger an event
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event handler:`, error);
      }
    });
  }
};

// Integration with calculators
const calculatorIntegration = {
  // Get calculator data for dashboard display
  getCalculatorResults(type, params) {
    return new Promise((resolve, reject) => {
      try {
        let result;
        
        switch (type) {
          case 'emi':
            result = this.calculateEMI(params.principal, params.interestRate, params.tenure);
            break;
          case 'investment':
            result = this.calculateInvestmentReturns(params);
            break;
          case 'stampDuty':
            result = this.calculateStampDuty(params.propertyValue, params.state);
            break;
          default:
            throw new Error(`Unknown calculator type: ${type}`);
        }
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // EMI calculator
  calculateEMI(principal, interestRate, tenure) {
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(emi * months),
      totalInterest: Math.round(emi * months - principal),
      principal
    };
  },
  
  // Investment returns calculator
  calculateInvestmentReturns(params) {
    const { purchasePrice, annualAppreciation, rentalYield, holdingPeriod, expenses } = params;
    
    // Calculate appreciation
    const appreciatedValue = purchasePrice * Math.pow(1 + (annualAppreciation / 100), holdingPeriod);
    const capitalGain = appreciatedValue - purchasePrice;
    
    // Calculate rental income
    const annualRental = purchasePrice * (rentalYield / 100);
    const totalRentalIncome = annualRental * holdingPeriod;
    
    // Calculate expenses
    const totalExpenses = (expenses / 100) * totalRentalIncome;
    
    // Calculate ROI
    const totalReturns = capitalGain + totalRentalIncome - totalExpenses;
    const roi = (totalReturns / purchasePrice) * 100;
    
    return {
      appreciatedValue: Math.round(appreciatedValue),
      capitalGain: Math.round(capitalGain),
      totalRentalIncome: Math.round(totalRentalIncome),
      totalExpenses: Math.round(totalExpenses),
      totalReturns: Math.round(totalReturns),
      roi: roi.toFixed(2)
    };
  },
  
  // Stamp duty calculator
  calculateStampDuty(propertyValue, state) {
    // Simplified stamp duty rates by state
    const rates = {
      'Telangana': 7.5,
      'Maharashtra': 5,
      'Karnataka': 5.6,
      'Tamil Nadu': 7,
      'Delhi': 6,
      'default': 5
    };
    
    const rate = rates[state] || rates.default;
    const stampDuty = propertyValue * (rate / 100);
    const registrationFee = Math.min(propertyValue * 0.01, 30000);
    
    return {
      stampDuty: Math.round(stampDuty),
      registrationFee: Math.round(registrationFee),
      total: Math.round(stampDuty + registrationFee),
      rate
    };
  }
};

// Integration with score system
const scoreIntegration = {
  // Convert project data to score metrics
  projectToScoreMetrics(project) {
    return {
      projectId: project._id,
      projectName: project.name,
      location: `${project.location.area}, ${project.location.city}`,
      metrics: [
        {
          name: 'Progress',
          value: project.progress,
          target: 100,
          unit: '%'
        },
        {
          name: 'Budget Utilization',
          value: project.budget.spent,
          target: project.budget.total,
          unit: '₹'
        },
        {
          name: 'Tasks Completed',
          value: project.tasks.filter(task => task.status === 'done').length,
          target: project.tasks.length,
          unit: 'tasks'
        }
      ]
    };
  },
  
  // Get score data for projects
  getProjectScores(projects) {
    return projects.map(project => this.projectToScoreMetrics(project));
  }
};

// Integration with the main website
const websiteIntegration = {
  // URLs for the main website components
  urls: {
    calculators: {
      emi: '/calculators/emi-calculator',
      investment: '/calculators/investment-calculator',
      stampDuty: '/calculators/stamp-duty-calculator'
    },
    projects: '/projects',
    contact: '/contact',
    properties: '/properties'
  },
  
  // Open a page on the main website
  openMainWebsitePage(page, params = {}) {
    const baseUrl = 'https://neopolisinfra.com';
    const url = this.urls[page] || page;
    
    // Build query string for parameters
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const fullUrl = `${baseUrl}${url}${queryString ? '?' + queryString : ''}`;
    
    window.open(fullUrl, '_blank');
  }
};

// Main integration interface
export const integration = {
  bridge: componentBridge,
  calculators: calculatorIntegration,
  scores: scoreIntegration,
  website: websiteIntegration,
  
  // Initialize all integrations
  initialize() {
    console.log('Initializing component integrations...');
    
    // Setup event listeners for cross-component communication
    this.setupEventListeners();
    
    return {
      status: 'success',
      message: 'Integrations initialized successfully'
    };
  },
  
  // Setup event listeners
  setupEventListeners() {
    // Handle calculator requests from project management
    this.bridge.on('calculator:request', (data) => {
      this.calculators.getCalculatorResults(data.type, data.params)
        .then(result => {
          this.bridge.emit('calculator:response', {
            requestId: data.requestId,
            result
          });
        })
        .catch(error => {
          this.bridge.emit('calculator:error', {
            requestId: data.requestId,
            error: error.message
          });
        });
    });
    
    // Handle project updates for score system
    this.bridge.on('project:updated', (project) => {
      const scoreMetrics = this.scores.projectToScoreMetrics(project);
      this.bridge.emit('score:update', scoreMetrics);
    });
  }
};

export default integration;