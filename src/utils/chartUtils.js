/**
 * Chart Utilities
 * Helper functions for chart components
 */

// Chart color palettes
export const CHART_COLORS = {
  primary: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'],
  secondary: ['#081d4a', '#283655', '#4D648D', '#337CCF', '#1D5B79', '#00587A'],
  status: {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    primary: '#3f51b5',
    secondary: '#9c27b0'
  }
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with comma
export const formatNumber = (num) => {
  if (!num && num !== 0) return 'N/A';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format percentage
export const formatPercentage = (value) => {
  if (!value && value !== 0) return 'N/A';
  return `${value.toFixed(1)}%`;
};

// Get score color based on value
export const getScoreColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'primary';
  if (score >= 40) return 'warning';
  return 'error';
};

// Get score color for charts
export const getScoreColorHex = (score) => {
  if (score >= 80) return CHART_COLORS.status.success;
  if (score >= 60) return CHART_COLORS.status.primary;
  if (score >= 40) return CHART_COLORS.status.warning;
  return CHART_COLORS.status.error;
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

// Format score value
export const formatScore = (score) => {
  if (!score && score !== 0) return 'N/A';
  return score.toFixed(1);
};

// Generate mock time series data
export const generateTimeSeriesData = (length = 12, baseValue = 50, volatility = 0.2) => {
  const data = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < length; i++) {
    // Generate a random change with the given volatility
    const change = baseValue * volatility * (Math.random() - 0.5);
    currentValue += change;
    
    // Ensure value stays within reasonable bounds
    currentValue = Math.max(0, Math.min(100, currentValue));
    
    // Create a date for this point (going back from current date)
    const date = new Date();
    date.setMonth(date.getMonth() - (length - i - 1));
    
    data.push({
      date: date.toISOString().substring(0, 10),
      value: parseFloat(currentValue.toFixed(1))
    });
  }
  
  return data;
};

// Generate mock distribution data
export const generateDistributionData = (categories, includeTotal = false) => {
  const data = [];
  let total = 0;
  
  for (const category of categories) {
    const value = Math.floor(Math.random() * 100) + 10;
    total += value;
    
    data.push({
      name: category,
      value
    });
  }
  
  // Optionally add a total
  if (includeTotal) {
    return {
      data,
      total
    };
  }
  
  return data;
};

// Create dummy score factors
export const createScoreFactors = (count = 4, totalScore = 75) => {
  const factors = [
    'Location Value', 'Market Demand', 'Growth Potential', 'Infrastructure',
    'Amenities', 'Construction Quality', 'Documentation', 'Legal Status',
    'Price Point', 'Size Relevance', 'Layout Efficiency', 'Design Appeal',
    'Communication', 'Response Time', 'Conversion Rate', 'Client Satisfaction'
  ];
  
  // Shuffle and take first 'count' elements
  const selectedFactors = [...factors]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  
  // Generate random weights that sum to 1
  let weights = Array(count).fill(0).map(() => Math.random());
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  weights = weights.map(w => w / weightSum);
  
  // Generate values that average to approximately the total score
  const values = [];
  let remainingWeightedSum = totalScore;
  let remainingWeight = 1;
  
  for (let i = 0; i < count - 1; i++) {
    // This ensures the weighted average will be close to totalScore
    const maxPossibleValue = (remainingWeightedSum + remainingWeight * 100 - weights[i] * 100) / remainingWeight;
    const minPossibleValue = (remainingWeightedSum - remainingWeight * 0) / remainingWeight;
    
    // Clamp between 0 and 100
    const minValue = Math.max(0, Math.min(100, minPossibleValue));
    const maxValue = Math.max(0, Math.min(100, maxPossibleValue));
    
    // Generate a random value in the possible range
    const value = Math.min(100, Math.max(0, Math.random() * (maxValue - minValue) + minValue));
    values.push(parseFloat(value.toFixed(1)));
    
    remainingWeightedSum -= weights[i] * value;
    remainingWeight -= weights[i];
  }
  
  // Calculate the last value to maintain the average
  const lastValue = Math.min(100, Math.max(0, remainingWeightedSum / remainingWeight));
  values.push(parseFloat(lastValue.toFixed(1)));
  
  // Create the score factors array
  return selectedFactors.map((factor, index) => ({
    factor,
    weight: parseFloat(weights[index].toFixed(2)),
    value: values[index]
  }));
};

// Get gradient for progress bars
export const getProgressGradient = (value) => {
  if (value >= 80) return 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)';
  if (value >= 60) return 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)';
  if (value >= 40) return 'linear-gradient(90deg, #ff9800 0%, #ffeb3b 100%)';
  return 'linear-gradient(90deg, #f44336 0%, #ff9800 100%)';
};