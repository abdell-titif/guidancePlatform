const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide skill name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Skill name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'domain-specific'],
    required: true
  },
  subcategory: String,
  description: {
    type: String,
    required: [true, 'Please provide skill description']
  },
  marketValue: {
    demandScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    growthRate: Number,
    salaryImpact: Number,
    topIndustries: [String]
  },
  learningDifficulty: {
    type: Number,
    min: 1,
    max: 5
  },
  timeToLearn: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'],
      default: 'months'
    }
  },
  prerequisites: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    importance: {
      type: String,
      enum: ['required', 'recommended', 'helpful'],
      default: 'recommended'
    }
  }],
  relatedSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  learningResources: [{
    title: {
      type: String,
      required: true
    },
    provider: String,
    type: {
      type: String,
      enum: ['course', 'book', 'video', 'article', 'tutorial', 'certification'],
      required: true
    },
    url: String,
    cost: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months'],
        default: 'hours'
      }
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    rating: {
      score: {
        type: Number,
        min: 0,
        max: 5
      },
      count: Number
    },
    description: String
  }],
  careers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
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
SkillSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  subcategory: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Skill', SkillSchema);
