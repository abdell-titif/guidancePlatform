# Database Schema Design

## User Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  createdAt: Date,
  updatedAt: Date,
  role: String, // "student", "counselor", "admin"
  profile: {
    educationLevel: String, // "high_school", "undergraduate", "graduate", "professional"
    currentInstitution: String,
    graduationYear: Number,
    location: {
      country: String,
      state: String,
      city: String
    },
    bio: String,
    profilePicture: String // URL to image
  },
  academicProfile: {
    grades: [
      {
        subject: String,
        grade: String,
        level: String, // "AP", "IB", "Regular", etc.
        year: Number
      }
    ],
    standardizedTests: [
      {
        name: String, // "SAT", "ACT", "GRE", etc.
        score: Number,
        date: Date
      }
    ],
    gpa: {
      value: Number,
      scale: Number // Typically 4.0 or 5.0
    },
    majors: [String],
    minors: [String],
    certificates: [
      {
        name: String,
        issuer: String,
        date: Date,
        url: String
      }
    ]
  },
  interests: [
    {
      category: String,
      subcategories: [String],
      strengthOfInterest: Number // 1-10 scale
    }
  ],
  skills: [
    {
      name: String,
      category: String, // "technical", "soft", etc.
      proficiencyLevel: Number, // 1-5 scale
      yearsOfExperience: Number
    }
  ],
  careerGoals: [
    {
      title: String,
      industry: String,
      priority: Number, // 1-5 scale
      timeframe: String // "short_term", "mid_term", "long_term"
    }
  ],
  preferences: {
    locationPreferences: [String],
    workEnvironmentPreferences: [String], // "remote", "hybrid", "in-person"
    salaryExpectations: {
      minimum: Number,
      preferred: Number,
      currency: String
    },
    workLifeBalanceImportance: Number, // 1-10 scale
    companySize: [String], // "startup", "small", "medium", "large", "enterprise"
    industryPreferences: [String]
  },
  recommendations: [
    {
      _id: ObjectId,
      type: String, // "career", "education", "skill"
      title: String,
      description: String,
      relevanceScore: Number, // Algorithm-generated score
      dateGenerated: Date,
      status: String, // "active", "dismissed", "saved", "completed"
      feedback: {
        rating: Number, // 1-5 scale
        comments: String
      }
    }
  ],
  savedItems: [
    {
      type: String, // "career", "education", "skill", "article"
      referenceId: ObjectId,
      savedAt: Date
    }
  ],
  activityLog: [
    {
      action: String,
      timestamp: Date,
      details: Object
    }
  ],
  settings: {
    notifications: {
      email: Boolean,
      push: Boolean,
      frequency: String // "daily", "weekly", "monthly"
    },
    privacy: {
      profileVisibility: String, // "public", "connections", "private"
      dataSharing: Boolean // Consent for data usage in recommendations
    },
    theme: String,
    language: String
  },
  socialConnections: {
    linkedIn: String, // Profile URL
    twitter: String, // Profile URL
    facebook: String, // Profile URL
    connections: [ObjectId] // References to other users
  },
  subscription: {
    plan: String, // "free", "premium", "enterprise"
    startDate: Date,
    endDate: Date,
    paymentStatus: String,
    features: [String]
  }
}
```

## Education Collection

```javascript
{
  _id: ObjectId,
  type: String, // "university", "college", "vocational", "online_course", "certification"
  name: String,
  description: String,
  location: {
    country: String,
    state: String,
    city: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  accreditation: [String],
  ranking: {
    source: String,
    rank: Number,
    year: Number
  },
  admissions: {
    acceptanceRate: Number,
    averageGPA: Number,
    averageTestScores: {
      SAT: Number,
      ACT: Number
    },
    applicationDeadlines: {
      regular: Date,
      early: Date
    },
    requirements: [String]
  },
  programs: [
    {
      _id: ObjectId,
      name: String,
      degree: String, // "Bachelor", "Master", "PhD", "Certificate", etc.
      department: String,
      description: String,
      duration: {
        value: Number,
        unit: String // "years", "months", "weeks"
      },
      format: [String], // "in-person", "online", "hybrid"
      credits: Number,
      curriculum: [
        {
          courseCode: String,
          name: String,
          credits: Number,
          description: String,
          prerequisites: [String]
        }
      ],
      outcomes: {
        careers: [String],
        skills: [String],
        furtherEducation: [String]
      },
      employmentStats: {
        employmentRate: Number,
        averageStartingSalary: Number,
        topEmployers: [String]
      },
      tuition: {
        amount: Number,
        currency: String,
        period: String, // "year", "semester", "program"
        residencyStatus: String // "in-state", "out-of-state", "international"
      },
      financialAid: {
        scholarships: [
          {
            name: String,
            amount: Number,
            eligibility: String
          }
        ],
        grants: [String],
        workStudy: Boolean
      }
    }
  ],
  facilities: [String],
  studentLife: {
    housingOptions: [String],
    clubs: [String],
    athletics: [String],
    events: [String]
  },
  reviews: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      date: Date
    }
  ],
  images: [String], // URLs
  website: String,
  contactInfo: {
    email: String,
    phone: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },
  lastUpdated: Date
}
```

## Career Collection

```javascript
{
  _id: ObjectId,
  title: String,
  alternativeTitles: [String],
  description: String,
  category: String,
  subcategories: [String],
  industries: [String],
  functions: [String], // "Engineering", "Marketing", "Finance", etc.
  educationRequirements: [
    {
      level: String, // "High School", "Bachelor's", "Master's", "PhD", etc.
      fields: [String],
      preferred: Boolean
    }
  ],
  skillRequirements: [
    {
      name: String,
      category: String, // "technical", "soft", etc.
      importance: Number, // 1-5 scale
      level: String // "beginner", "intermediate", "advanced", "expert"
    }
  ],
  experienceRequirements: {
    minYears: Number,
    recommendedYears: Number,
    relevantRoles: [String]
  },
  certifications: [
    {
      name: String,
      provider: String,
      importance: String, // "required", "preferred", "optional"
      url: String
    }
  ],
  careerPath: {
    entryLevelPositions: [String],
    midLevelPositions: [String],
    seniorPositions: [String]
  },
  salaryInfo: [
    {
      country: String,
      region: String,
      experience: String, // "entry", "mid", "senior"
      median: Number,
      range: {
        min: Number,
        max: Number
      },
      currency: String,
      year: Number,
      source: String
    }
  ],
  jobGrowth: {
    rate: Number,
    period: String, // "1 year", "5 years", "10 years"
    trend: String, // "increasing", "stable", "declining"
    source: String
  },
  workEnvironment: {
    settings: [String], // "office", "remote", "field", etc.
    schedule: [String], // "9-5", "shifts", "flexible", etc.
    physicalDemands: String,
    travelRequirements: String
  },
  dayInTheLife: String, // Description of typical workday
  prosAndCons: {
    pros: [String],
    cons: [String]
  },
  relatedCareers: [ObjectId], // References to other career documents
  notableProfessionals: [
    {
      name: String,
      title: String,
      company: String,
      profile: String // URL
    }
  ],
  resources: [
    {
      type: String, // "article", "video", "course", "book", "organization"
      title: String,
      url: String,
      description: String
    }
  ],
  marketData: {
    demandScore: Number, // 1-100 scale
    competitionScore: Number, // 1-100 scale
    topLocations: [
      {
        country: String,
        region: String,
        city: String,
        jobCount: Number,
        averageSalary: Number
      }
    ],
    topEmployers: [
      {
        name: String,
        industry: String,
        jobCount: Number,
        averageSalary: Number
      }
    ],
    requiredSkillsTrends: [
      {
        skill: String,
        growthRate: Number,
        year: Number
      }
    ]
  },
  lastUpdated: Date,
  source: String
}
```

## Skill Collection

```javascript
{
  _id: ObjectId,
  name: String,
  alternativeNames: [String],
  category: String, // "technical", "soft", "domain-specific"
  subcategory: String,
  description: String,
  relevantIndustries: [String],
  relevantCareers: [ObjectId], // References to career documents
  marketValue: {
    demandScore: Number, // 1-100 scale
    growthRate: Number, // Percentage
    salaryImpact: Number // Average salary increase in percentage
  },
  learningResources: [
    {
      type: String, // "course", "book", "video", "website", "practice"
      title: String,
      provider: String,
      url: String,
      cost: {
        amount: Number,
        currency: String
      },
      duration: {
        value: Number,
        unit: String // "hours", "days", "weeks", "months"
      },
      level: String, // "beginner", "intermediate", "advanced"
      rating: Number,
      reviewCount: Number
    }
  ],
  assessmentMethods: [
    {
      name: String,
      description: String,
      url: String
    }
  ],
  relatedSkills: [
    {
      skillId: ObjectId,
      relationshipType: String // "prerequisite", "complementary", "advanced"
    }
  ],
  certifications: [
    {
      name: String,
      provider: String,
      level: String,
      cost: {
        amount: Number,
        currency: String
      },
      validity: {
        value: Number,
        unit: String // "years", "lifetime"
      },
      url: String
    }
  ],
  lastUpdated: Date
}
```

## Market Insights Collection

```javascript
{
  _id: ObjectId,
  date: Date,
  source: String,
  region: {
    country: String,
    state: String,
    city: String
  },
  industry: String,
  metrics: {
    jobGrowth: Number, // Percentage
    unemploymentRate: Number, // Percentage
    averageSalary: Number,
    jobPostings: Number,
    topEmployers: [
      {
        name: String,
        jobCount: Number,
        industry: String
      }
    ],
    inDemandSkills: [
      {
        name: String,
        demandScore: Number,
        growthRate: Number
      }
    ],
    emergingRoles: [
      {
        title: String,
        growthRate: Number,
        averageSalary: Number
      }
    ]
  },
  educationStats: {
    graduationRates: [
      {
        degree: String,
        rate: Number
      }
    ],
    employmentByEducation: [
      {
        educationLevel: String,
        employmentRate: Number,
        averageSalary: Number
      }
    ],
    returnOnInvestment: [
      {
        degree: String,
        field: String,
        roi: Number // Percentage
      }
    ]
  },
  forecast: {
    timeframe: String, // "1 year", "5 years", "10 years"
    jobGrowthProjection: Number, // Percentage
    emergingSkills: [String],
    decliningRoles: [String],
    salaryTrends: [
      {
        role: String,
        trend: Number // Percentage change
      }
    ]
  },
  lastUpdated: Date
}
```

## Learning Resource Collection

```javascript
{
  _id: ObjectId,
  title: String,
  provider: String,
  type: String, // "course", "book", "video", "article", "tutorial"
  format: String, // "online", "in-person", "hybrid", "self-paced"
  url: String,
  description: String,
  topics: [String],
  skills: [ObjectId], // References to skill documents
  level: String, // "beginner", "intermediate", "advanced", "all-levels"
  prerequisites: [String],
  duration: {
    value: Number,
    unit: String // "hours", "days", "weeks", "months"
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    isFlexible: Boolean
  },
  cost: {
    amount: Number,
    currency: String,
    hasFreeOption: Boolean,
    hasTrialOption: Boolean
  },
  certification: {
    offered: Boolean,
    name: String,
    accredited: Boolean,
    recognizedBy: [String]
  },
  ratings: {
    average: Number,
    count: Number,
    source: String
  },
  reviews: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      date: Date
    }
  ],
  completionStats: {
    completionRate: Number,
    averageCompletionTime: {
      value: Number,
      unit: String
    }
  },
  outcomes: {
    skills: [String],
    careers: [String],
    successStories: [String]
  },
  lastUpdated: Date
}
```
