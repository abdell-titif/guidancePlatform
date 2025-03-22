const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Education = require('../models/Education');
const LearningResource = require('../models/LearningResource');

// @desc    Search for educational programs
// @route   GET /api/v1/education/search
// @access  Private
exports.searchEducationalPrograms = asyncHandler(async (req, res, next) => {
  const { 
    query, 
    degree, 
    field, 
    location, 
    format, 
    duration, 
    tuitionMin, 
    tuitionMax 
  } = req.query;
  
  // Build search criteria
  const searchCriteria = {};
  
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  if (degree) {
    searchCriteria.degree = degree;
  }
  
  if (field) {
    searchCriteria.fieldOfStudy = { $regex: field, $options: 'i' };
  }
  
  if (location) {
    searchCriteria.$or = [
      { 'institution.location.city': { $regex: location, $options: 'i' } },
      { 'institution.location.state': { $regex: location, $options: 'i' } },
      { 'institution.location.country': { $regex: location, $options: 'i' } }
    ];
  }
  
  if (format && format !== 'all') {
    searchCriteria.format = format;
  }
  
  if (duration) {
    const [value, unit] = duration.split('-');
    if (value && unit) {
      searchCriteria['duration.value'] = { $lte: parseInt(value) };
      searchCriteria['duration.unit'] = unit;
    }
  }
  
  if (tuitionMin || tuitionMax) {
    searchCriteria.tuition = {};
    if (tuitionMin) {
      searchCriteria.tuition.amount = { $gte: parseInt(tuitionMin) };
    }
    if (tuitionMax) {
      if (searchCriteria.tuition.amount) {
        searchCriteria.tuition.amount.$lte = parseInt(tuitionMax);
      } else {
        searchCriteria.tuition.amount = { $lte: parseInt(tuitionMax) };
      }
    }
  }
  
  try {
    // Search our database first
    const programs = await Education.find(searchCriteria)
      .sort({ 'institution.ranking.rank': 1 })
      .limit(20);
    
    // If we have enough results, return them
    if (programs.length >= 10) {
      return res.status(200).json({
        success: true,
        count: programs.length,
        data: programs
      });
    }
    
    // If we don't have enough results, we would fetch from external APIs
    // For this implementation, we'll just return what we have
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
      message: programs.length === 0 ? 'No educational programs found matching your criteria.' : undefined
    });
  } catch (error) {
    return next(new ErrorResponse(`Error searching educational programs: ${error.message}`, 500));
  }
});

// @desc    Get educational program details
// @route   GET /api/v1/education/:id
// @access  Private
exports.getEducationalProgram = asyncHandler(async (req, res, next) => {
  const program = await Education.findById(req.params.id);
  
  if (!program) {
    return next(new ErrorResponse(`Educational program not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: program
  });
});

// @desc    Get learning resources for a skill
// @route   GET /api/v1/education/resources/:skillId
// @access  Private
exports.getLearningResources = asyncHandler(async (req, res, next) => {
  const { skillId } = req.params;
  const { type, format, difficulty, isFree } = req.query;
  
  // Build search criteria
  const searchCriteria = {
    skills: skillId
  };
  
  if (type) {
    searchCriteria.type = type;
  }
  
  if (format) {
    searchCriteria.format = format;
  }
  
  if (difficulty) {
    searchCriteria.difficulty = difficulty;
  }
  
  if (isFree === 'true') {
    searchCriteria['cost.isFree'] = true;
  }
  
  const resources = await LearningResource.find(searchCriteria)
    .sort({ 'rating.score': -1 })
    .limit(20);
  
  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources
  });
});

// @desc    Get top educational institutions
// @route   GET /api/v1/education/institutions/top
// @access  Private
exports.getTopInstitutions = asyncHandler(async (req, res, next) => {
  const { field, country, limit = 10 } = req.query;
  
  // Aggregate to get top institutions
  const aggregationPipeline = [
    {
      $match: {}
    },
    {
      $group: {
        _id: '$institution.name',
        institution: { $first: '$institution' },
        programCount: { $sum: 1 },
        averageRanking: { $avg: '$institution.ranking.rank' }
      }
    },
    {
      $sort: { averageRanking: 1 }
    },
    {
      $limit: parseInt(limit)
    }
  ];
  
  // Add field filter if provided
  if (field) {
    aggregationPipeline[0].$match.fieldOfStudy = { $regex: field, $options: 'i' };
  }
  
  // Add country filter if provided
  if (country) {
    aggregationPipeline[0].$match['institution.location.country'] = { $regex: country, $options: 'i' };
  }
  
  const topInstitutions = await Education.aggregate(aggregationPipeline);
  
  res.status(200).json({
    success: true,
    count: topInstitutions.length,
    data: topInstitutions
  });
});

// @desc    Get educational statistics
// @route   GET /api/v1/education/statistics
// @access  Private
exports.getEducationStatistics = asyncHandler(async (req, res, next) => {
  // Get counts by degree type
  const degreeStats = await Education.aggregate([
    {
      $group: {
        _id: '$degree',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  // Get counts by field of study
  const fieldStats = await Education.aggregate([
    {
      $group: {
        _id: '$fieldOfStudy',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);
  
  // Get average tuition by degree
  const tuitionStats = await Education.aggregate([
    {
      $group: {
        _id: '$degree',
        averageTuition: { $avg: '$tuition.amount' },
        minTuition: { $min: '$tuition.amount' },
        maxTuition: { $max: '$tuition.amount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Get employment statistics
  const employmentStats = await Education.aggregate([
    {
      $match: { 'careerOutcomes.employmentRate': { $exists: true } }
    },
    {
      $group: {
        _id: '$degree',
        averageEmploymentRate: { $avg: '$careerOutcomes.employmentRate' },
        averageStartingSalary: { $avg: '$careerOutcomes.averageStartingSalary' }
      }
    },
    {
      $sort: { averageEmploymentRate: -1 }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      degreeStats,
      fieldStats,
      tuitionStats,
      employmentStats
    }
  });
});
