const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide program name'],
    trim: true,
    maxlength: [100, 'Program name cannot be more than 100 characters']
  },
  institution: {
    name: {
      type: String,
      required: [true, 'Please provide institution name'],
      trim: true
    },
    type: {
      type: String,
      enum: ['university', 'college', 'vocational', 'online', 'other'],
      required: true
    },
    location: {
      country: String,
      state: String,
      city: String
    },
    website: String,
    accreditation: [String],
    ranking: {
      rank: Number,
      source: String
    },
    logo: String
  },
  degree: {
    type: String,
    enum: ['certificate', 'associate', 'bachelor', 'master', 'doctorate', 'professional'],
    required: true
  },
  fieldOfStudy: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide program description']
  },
  duration: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['weeks', 'months', 'years'],
      default: 'years'
    }
  },
  format: {
    type: [String],
    enum: ['in-person', 'online', 'hybrid'],
    required: true
  },
  tuition: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['total', 'per year', 'per semester', 'per credit'],
      default: 'total'
    }
  },
  financialAid: {
    available: {
      type: Boolean,
      default: false
    },
    types: [String]
  },
  admissionRequirements: [{
    requirement: String,
    description: String,
    mandatory: {
      type: Boolean,
      default: true
    }
  }],
  applicationDeadlines: [{
    term: String,
    date: Date
  }],
  curriculum: [{
    name: String,
    description: String,
    credits: Number
  }],
  careerOutcomes: {
    employmentRate: Number,
    averageStartingSalary: Number,
    commonJobTitles: [String],
    industries: [String]
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
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
EducationSchema.index({ 
  name: 'text', 
  'institution.name': 'text', 
  fieldOfStudy: 'text', 
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Education', EducationSchema);
