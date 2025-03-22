const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide career title'],
    trim: true,
    maxlength: [100, 'Career title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide career description']
  },
  industry: {
    type: String,
    required: [true, 'Please provide industry']
  },
  subIndustry: String,
  functions: [String],
  skills: [{
    name: {
      type: String,
      required: true
    },
    importance: {
      type: String,
      enum: ['essential', 'preferred', 'bonus'],
      default: 'preferred'
    },
    description: String
  }],
  educationRequirements: [{
    level: {
      type: String,
      enum: ['high school', 'associate', 'bachelor', 'master', 'doctorate', 'professional', 'certification'],
      required: true
    },
    fieldOfStudy: String,
    importance: {
      type: String,
      enum: ['required', 'preferred', 'alternative'],
      default: 'preferred'
    }
  }],
  experienceRequirements: {
    minYears: Number,
    preferredYears: Number,
    description: String
  },
  salaryInfo: {
    median: {
      type: Number,
      required: true
    },
    range: {
      min: Number,
      max: Number
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
  jobGrowth: {
    rate: Number,
    period: {
      type: String,
      enum: ['1 year', '5 years', '10 years'],
      default: '10 years'
    },
    description: String
  },
  workEnvironment: {
    settings: [String],
    schedule: [String],
    travelRequirements: String,
    remoteOptions: [String]
  },
  careerPath: {
    entryLevelPositions: [String],
    midLevelPositions: [String],
    seniorPositions: [String],
    relatedOccupations: [String]
  },
  topEmployers: [{
    name: String,
    industry: String,
    website: String,
    logo: String
  }],
  dayInTheLife: {
    responsibilities: [String],
    challenges: [String],
    rewards: [String]
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['article', 'video', 'course', 'book', 'website', 'organization'],
      required: true
    },
    url: String,
    description: String
  }],
  tags: [String],
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
CareerSchema.index({ 
  title: 'text', 
  description: 'text', 
  industry: 'text',
  'skills.name': 'text',
  tags: 'text'
});

module.exports = mongoose.model('Career', CareerSchema);
