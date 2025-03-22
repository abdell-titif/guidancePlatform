const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide resource title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  provider: {
    name: {
      type: String,
      required: true
    },
    website: String,
    logo: String
  },
  type: {
    type: String,
    enum: ['course', 'book', 'video', 'article', 'tutorial', 'certification', 'podcast', 'webinar'],
    required: true
  },
  format: {
    type: [String],
    enum: ['online', 'in-person', 'hybrid', 'self-paced', 'instructor-led', 'interactive'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide resource description']
  },
  thumbnail: String,
  cost: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    isFree: {
      type: Boolean,
      default: false
    },
    hasTrial: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days', 'weeks', 'months'],
      default: 'hours'
    }
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'intermediate'
  },
  prerequisites: [String],
  learningOutcomes: [String],
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  careers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5
    },
    count: Number,
    source: String
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
  completionCriteria: {
    hasAssessment: {
      type: Boolean,
      default: false
    },
    hasCertificate: {
      type: Boolean,
      default: false
    },
    estimatedCompletionTime: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months'],
        default: 'hours'
      }
    }
  },
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
LearningResourceSchema.index({ 
  title: 'text', 
  description: 'text',
  'provider.name': 'text',
  tags: 'text'
});

module.exports = mongoose.model('LearningResource', LearningResourceSchema);
