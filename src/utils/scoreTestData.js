/**
 * Score Test Data Generator
 * Utility to generate test data for the score tracking system
 */

import { createScoreFactors } from './chartUtils';

// Generate random date within past X days
const randomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Generate random score between min and max
const randomScore = (min = 30, max = 95) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random lead status
const randomLeadStatus = () => {
  const statuses = ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'];
  const weights = [3, 4, 3, 2, 1, 2]; // Weighted distribution
  
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < statuses.length; i++) {
    random -= weights[i];
    if (random <= 0) return statuses[i];
  }
  
  return statuses[0];
};

// Generate random property status
const randomPropertyStatus = () => {
  const statuses = ['available', 'pending', 'sold'];
  const weights = [5, 2, 3]; // Weighted distribution
  
  let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < statuses.length; i++) {
    random -= weights[i];
    if (random <= 0) return statuses[i];
  }
  
  return statuses[0];
};

// Generate random property type
const randomPropertyType = () => {
  const types = ['residential', 'commercial', 'land'];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate random lead source
const randomLeadSource = () => {
  const sources = ['website', 'referral', 'social', 'advertisement', 'direct', 'other'];
  return sources[Math.floor(Math.random() * sources.length)];
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

// Generate random property name
const randomPropertyName = (area, type) => {
  const prefixes = ['Royal', 'Green', 'Metro', 'Urban', 'Prime', 'Luxury', 'Elite', 'Golden', 'Silver', 'Diamond'];
  const suffixes = ['Residency', 'Heights', 'Towers', 'Arcade', 'Plaza', 'Gardens', 'Enclave', 'Paradise', 'Estate', 'Court'];
  
  if (type === 'residential') {
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  } else if (type === 'commercial') {
    return `${area} Business ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  } else {
    return `${area} ${prefixes[Math.floor(Math.random() * prefixes.length)]} Plot`;
  }
};

// Generate random budget
const randomBudget = (min, max) => {
  return {
    min: Math.floor((Math.random() * (min * 0.8)) + min),
    max: Math.floor((Math.random() * (max - min)) + min)
  };
};

// Generate random property price
const randomPrice = (type) => {
  if (type === 'residential') {
    return Math.floor((Math.random() * 5000000) + 3000000); // 30L to 80L
  } else if (type === 'commercial') {
    return Math.floor((Math.random() * 10000000) + 5000000); // 50L to 1.5Cr
  } else {
    return Math.floor((Math.random() * 8000000) + 2000000); // 20L to 1Cr
  }
};

// Generate random property size
const randomSize = (type) => {
  if (type === 'residential') {
    return Math.floor((Math.random() * 1000) + 1000); // 1000 to 2000 sq ft
  } else if (type === 'commercial') {
    return Math.floor((Math.random() * 3000) + 2000); // 2000 to 5000 sq ft
  } else {
    return Math.floor((Math.random() * 5000) + 3000); // 3000 to 8000 sq ft
  }
};

// Generate random property amenities
const randomAmenities = (type) => {
  const residentialAmenities = ['Parking', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Club House', 'Garden', 'Play Area'];
  const commercialAmenities = ['Parking', 'Security', 'Power Backup', 'Conference Room', 'Cafeteria', 'HVAC', 'High-speed Internet'];
  const landAmenities = ['Road Access', 'Water Connection', 'Electricity', 'Boundary Wall', 'HMDA Approved'];
  
  const amenities = type === 'residential' ? residentialAmenities : 
                   type === 'commercial' ? commercialAmenities : landAmenities;
  
  const count = Math.floor(Math.random() * 4) + 2; // 2 to 5 amenities
  const selected = [];
  
  while (selected.length < count && selected.length < amenities.length) {
    const amenity = amenities[Math.floor(Math.random() * amenities.length)];
    if (!selected.includes(amenity)) {
      selected.push(amenity);
    }
  }
  
  return selected;
};

// Generate random agent performance
const randomAgentPerformance = (score) => {
  // Make performance somewhat correlated with score
  const basePerformance = score * 0.8;
  const variability = 20; // Allow some variability
  
  return {
    leadsHandled: Math.floor((Math.random() * 50) + 10),
    conversionRate: Math.floor((Math.random() * variability) + basePerformance - variability/2),
    revenueGenerated: Math.floor((Math.random() * 10000000) + 1000000),
    customerSatisfaction: Math.floor((Math.random() * variability) + basePerformance - variability/2),
    responseTime: Math.floor((Math.random() * 24) + 1)
  };
};

// Generate random user (for agents and creators)
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

// Generate lead score
const generateLeadScore = (userId) => {
  const score = randomScore();
  const status = randomLeadStatus();
  const name = randomName();
  const createdDate = randomDate(180); // Up to 6 months ago
  
  return {
    _id: `lead_${Math.floor(Math.random() * 1000)}`,
    type: 'lead',
    score,
    notes: `This lead is ${status === 'lost' ? 'no longer active' : 'actively being pursued'}. ${Math.random() > 0.7 ? 'Follow up required.' : ''}`,
    leadDetails: {
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      budget: randomBudget(2000000, 8000000), // 20L to 80L
      interestedIn: [`${randomArea()} ${randomPropertyType()}`],
      source: randomLeadSource(),
      status,
      assignedTo: randomUser()
    },
    scoreFactors: createScoreFactors(4, score),
    createdBy: userId ? { _id: userId } : randomUser(),
    createdAt: createdDate,
    updatedAt: new Date().toISOString()
  };
};

// Generate property score
const generatePropertyScore = (userId) => {
  const score = randomScore();
  const type = randomPropertyType();
  const area = randomArea();
  const status = randomPropertyStatus();
  const createdDate = randomDate(180); // Up to 6 months ago
  
  return {
    _id: `property_${Math.floor(Math.random() * 1000)}`,
    type: 'property',
    score,
    notes: `This ${type} property in ${area} is ${status}. ${Math.random() > 0.7 ? 'Good investment opportunity.' : ''}`,
    propertyDetails: {
      name: randomPropertyName(area, type),
      location: {
        area,
        city: 'Hyderabad'
      },
      type,
      price: randomPrice(type),
      size: randomSize(type),
      amenities: randomAmenities(type),
      status
    },
    scoreFactors: createScoreFactors(4, score),
    createdBy: userId ? { _id: userId } : randomUser(),
    createdAt: createdDate,
    updatedAt: new Date().toISOString()
  };
};

// Generate agent score
const generateAgentScore = (userId) => {
  const score = randomScore();
  const agent = randomUser();
  const createdDate = randomDate(180); // Up to 6 months ago
  
  return {
    _id: `agent_${Math.floor(Math.random() * 1000)}`,
    type: 'agent',
    score,
    notes: `${agent.firstName} is performing ${score >= 80 ? 'excellently' : score >= 60 ? 'well' : score >= 40 ? 'adequately' : 'poorly'}.`,
    agentDetails: {
      user: agent,
      performance: randomAgentPerformance(score),
      period: 'monthly'
    },
    scoreFactors: createScoreFactors(4, score),
    createdBy: userId ? { _id: userId } : randomUser(),
    createdAt: createdDate,
    updatedAt: new Date().toISOString()
  };
};

// Generate all types of scores
export const generateScores = (count = 10, userId) => {
  const scores = [];
  
  // Generate lead scores
  for (let i = 0; i < count; i++) {
    scores.push(generateLeadScore(userId));
  }
  
  // Generate property scores
  for (let i = 0; i < count; i++) {
    scores.push(generatePropertyScore(userId));
  }
  
  // Generate agent scores
  for (let i = 0; i < count; i++) {
    scores.push(generateAgentScore(userId));
  }
  
  return scores;
};

// Generate score statistics
export const generateScoreStats = () => {
  // Average scores by type
  const averageScores = [
    {
      _id: 'lead',
      averageScore: randomScore(60, 75),
      count: Math.floor(Math.random() * 50) + 30,
      highScores: Math.floor(Math.random() * 20) + 10,
      mediumScores: Math.floor(Math.random() * 20) + 15,
      lowScores: Math.floor(Math.random() * 10) + 5
    },
    {
      _id: 'property',
      averageScore: randomScore(70, 85),
      count: Math.floor(Math.random() * 30) + 20,
      highScores: Math.floor(Math.random() * 15) + 10,
      mediumScores: Math.floor(Math.random() * 10) + 8,
      lowScores: Math.floor(Math.random() * 5) + 2
    },
    {
      _id: 'agent',
      averageScore: randomScore(65, 80),
      count: Math.floor(Math.random() * 20) + 10,
      highScores: Math.floor(Math.random() * 8) + 5,
      mediumScores: Math.floor(Math.random() * 10) + 3,
      lowScores: Math.floor(Math.random() * 5) + 1
    }
  ];
  
  // Lead stats
  const leadStats = [
    {
      _id: 'new',
      count: Math.floor(Math.random() * 20) + 10,
      averageScore: randomScore(50, 70)
    },
    {
      _id: 'contacted',
      count: Math.floor(Math.random() * 15) + 15,
      averageScore: randomScore(60, 75)
    },
    {
      _id: 'qualified',
      count: Math.floor(Math.random() * 10) + 8,
      averageScore: randomScore(70, 85)
    },
    {
      _id: 'negotiation',
      count: Math.floor(Math.random() * 8) + 5,
      averageScore: randomScore(75, 90)
    },
    {
      _id: 'closed',
      count: Math.floor(Math.random() * 5) + 3,
      averageScore: randomScore(80, 95)
    },
    {
      _id: 'lost',
      count: Math.floor(Math.random() * 10) + 5,
      averageScore: randomScore(40, 60)
    }
  ];
  
  // Property stats
  const propertyStats = [
    {
      _id: 'residential',
      count: Math.floor(Math.random() * 20) + 10,
      averageScore: randomScore(70, 85)
    },
    {
      _id: 'commercial',
      count: Math.floor(Math.random() * 15) + 5,
      averageScore: randomScore(75, 90)
    },
    {
      _id: 'land',
      count: Math.floor(Math.random() * 10) + 5,
      averageScore: randomScore(65, 80)
    }
  ];
  
  // Score trend (last 6 months)
  const scoreTrend = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthNum = month.getMonth() + 1;
    const year = month.getFullYear();
    
    // Lead trend with some fluctuation but general improvement
    scoreTrend.push({
      _id: {
        month: monthNum,
        year,
        type: 'lead'
      },
      averageScore: randomScore(55 + (5 - i) * 2, 65 + (5 - i) * 2),
      count: Math.floor(Math.random() * 10) + 5
    });
    
    // Property trend with higher scores
    scoreTrend.push({
      _id: {
        month: monthNum,
        year,
        type: 'property'
      },
      averageScore: randomScore(65 + (5 - i), 80 + (5 - i)),
      count: Math.floor(Math.random() * 5) + 3
    });
    
    // Agent trend
    scoreTrend.push({
      _id: {
        month: monthNum,
        year,
        type: 'agent'
      },
      averageScore: randomScore(60 + (5 - i) * 1.5, 75 + (5 - i) * 1.5),
      count: Math.floor(Math.random() * 5) + 2
    });
  }
  
  // Score distribution
  const scoreDistribution = [];
  const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  const types = ['lead', 'property', 'agent'];
  
  for (const range of ranges) {
    for (const type of types) {
      let count;
      
      if (range === '0-20') {
        count = Math.floor(Math.random() * 3) + 1;
      } else if (range === '21-40') {
        count = Math.floor(Math.random() * 5) + 3;
      } else if (range === '41-60') {
        count = Math.floor(Math.random() * 10) + 5;
      } else if (range === '61-80') {
        count = Math.floor(Math.random() * 15) + 10;
      } else {
        count = Math.floor(Math.random() * 10) + 5;
      }
      
      scoreDistribution.push({
        _id: {
          range,
          type
        },
        count
      });
    }
  }
  
  return {
    averageScores,
    leadStats,
    propertyStats,
    scoreTrend,
    scoreDistribution
  };
};

// Generate top scores
export const generateTopScores = (type, limit = 5) => {
  const scores = [];
  
  for (let i = 0; i < limit; i++) {
    if (type === 'lead') {
      scores.push(generateLeadScore());
    } else if (type === 'property') {
      scores.push(generatePropertyScore());
    } else if (type === 'agent') {
      scores.push(generateAgentScore());
    }
  }
  
  // Sort by score in descending order
  return scores.sort((a, b) => b.score - a.score);
};

// Export default data object for mock services
export default {
  generateScores,
  generateScoreStats,
  generateTopScores
};