const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'professional', 'admin'],
    default: 'student'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  dateOfBirth: {
    type: Date
  },
  location: {
    country: String,
    state: String,
    city: String
  },
  contactInfo: {
    phone: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String
    }
  },
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String,
    activities: String,
    description: String
  }],
  experience: [{
    company: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    location: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String
  }],
  skills: [{
    name: {
      type: String,
      required: true
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 5
    },
    yearsOfExperience: Number,
    category: {
      type: String,
      enum: ['technical', 'soft', 'domain-specific']
    }
  }],
  interests: [{
    category: String,
    subcategories: [String]
  }],
  careerGoals: {
    shortTerm: String,
    longTerm: String,
    preferredIndustries: [String],
    preferredRoles: [String],
    preferredLocations: [String]
  },
  preferences: {
    jobType: {
      type: [String],
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
    },
    salaryExpectation: {
      currency: {
        type: String,
        default: 'USD'
      },
      amount: Number
    },
    workEnvironment: [String],
    companySize: [String],
    willingToRelocate: {
      type: Boolean,
      default: false
    }
  },
  savedItems: {
    careers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career'
    }],
    educationalPrograms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Education'
    }],
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }]
  },
  connections: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    connectionType: {
      type: String,
      enum: ['professional', 'peer', 'mentor', 'alumni'],
      default: 'professional'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['connection', 'message', 'recommendation', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    relatedTo: {
      model: String,
      id: mongoose.Schema.Types.ObjectId
    }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
