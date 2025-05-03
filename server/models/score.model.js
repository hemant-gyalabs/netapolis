/**
 * Score Model
 * Handles various types of scores (leads, properties, agents)
 */

const mongoose = require('mongoose');

// Score Schema
const scoreSchema = new mongoose.Schema({
  // Common fields
  type: {
    type: String,
    enum: ['lead', 'property', 'agent'],
    required: [true, 'Score type is required']
  },
  score: {
    type: Number,
    required: [true, 'Score value is required'],
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Lead-specific fields
  leadDetails: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    budget: {
      min: Number,
      max: Number
    },
    interestedIn: [String],
    source: {
      type: String,
      enum: ['website', 'referral', 'social', 'advertisement', 'direct', 'other'],
      default: 'website'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'negotiation', 'closed', 'lost'],
      default: 'new'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Property-specific fields
  propertyDetails: {
    name: {
      type: String,
      trim: true
    },
    location: {
      area: String,
      city: String
    },
    type: {
      type: String,
      enum: ['residential', 'commercial', 'land']
    },
    price: Number,
    size: Number,
    amenities: [String],
    status: {
      type: String,
      enum: ['available', 'pending', 'sold']
    }
  },
  
  // Agent-specific fields
  agentDetails: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performance: {
      leadsHandled: Number,
      conversionRate: Number,
      revenueGenerated: Number,
      customerSatisfaction: Number,
      responseTime: Number
    },
    period: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    }
  },
  
  // Common fields
  scoreFactors: [{
    factor: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  
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

// Index for faster querying
scoreSchema.index({ type: 1 });
scoreSchema.index({ score: 1 });
scoreSchema.index({ 'leadDetails.status': 1 });
scoreSchema.index({ 'propertyDetails.status': 1 });
scoreSchema.index({ 'agentDetails.user': 1 });

// Update the updatedAt timestamp
scoreSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate overall score from score factors
scoreSchema.pre('save', function(next) {
  if (this.scoreFactors && this.scoreFactors.length > 0) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    this.scoreFactors.forEach(factor => {
      weightedSum += factor.value * factor.weight;
      totalWeight += factor.weight;
    });
    
    if (totalWeight > 0) {
      this.score = Math.round(weightedSum / totalWeight);
    }
  }
  
  next();
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;