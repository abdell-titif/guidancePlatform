const mongoose = require('mongoose');

const MarketInsightSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: [true, 'Please provide industry'],
    trim: true
  },
  region: {
    country: {
      type: String,
      required: true
    },
    state: String,
    city: String
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  period: {
    type: String,
    enum: ['current', 'quarterly', 'annual', 'five-year'],
    default: 'current'
  },
  jobMarketData: {
    jobGrowth: {
      rate: Number,
      description: String
    },
    jobPostings: {
      count: Number,
      trend: {
        type: String,
        enum: ['increasing', 'stable', 'decreasing']
      }
    },
    unemploymentRate: Number,
    laborForceParticipation: Number
  },
  salaryData: {
    median: {
      type: Number,
      required: true
    },
    range: {
      min: Number,
      max: Number
    },
    percentiles: {
      p10: Number,
      p25: Number,
      p75: Number,
      p90: Number
    },
    byExperience: {
      entry: Number,
      mid: Number,
      senior: Number,
      executive: Number
    },
    byEducation: {
      highSchool: Number,
      associate: Number,
      bachelor: Number,
      master: Number,
      doctorate: Number
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'annual'],
      default: 'annual'
    }
  },
  skillDemand: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    demandScore: {
      type: Number,
      min: 0,
      max: 100
    },
    growthRate: Number,
    salaryImpact: Number
  }],
  topEmployers: [{
    name: String,
    industry: String,
    jobCount: Number,
    averageSalary: Number,
    growthRate: Number,
    website: String,
    logo: String
  }],
  industryTrends: {
    emergingRoles: [String],
    decliningRoles: [String],
    disruptiveTechnologies: [String],
    regulatoryChanges: [String]
  },
  source: {
    name: {
      type: String,
      required: true
    },
    url: String,
    retrievalDate: {
      type: Date,
      default: Date.now
    },
    methodology: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
MarketInsightSchema.index({ 
  industry: 'text', 
  'region.country': 'text',
  'region.state': 'text',
  'region.city': 'text'
});

module.exports = mongoose.model('MarketInsight', MarketInsightSchema);
