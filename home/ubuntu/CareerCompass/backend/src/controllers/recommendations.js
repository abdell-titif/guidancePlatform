const User = require('../models/User');
const Career = require('../models/Career');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get personalized career recommendations
// @route   GET /api/v1/recommendations/careers
// @access  Private
exports.getCareerRecommendations = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Extract user skills, interests, and education for recommendation algorithm
  const userSkills = user.skills.map(skill => skill.name.toLowerCase());
  const userInterests = user.interests.flatMap(interest => 
    [interest.category.toLowerCase(), ...interest.subcategories.map(sub => sub.toLowerCase())]
  );
  const userEducation = user.education.map(edu => ({
    fieldOfStudy: edu.fieldOfStudy.toLowerCase(),
    degree: edu.degree.toLowerCase()
  }));
  
  // Find careers that match user skills, interests, and education
  const careers = await Career.find({});
  
  // Calculate relevance score for each career
  const recommendations = careers.map(career => {
    // Calculate skill match score
    const careerSkills = career.skills.map(skill => skill.name.toLowerCase());
    const skillMatchCount = careerSkills.filter(skill => userSkills.includes(skill)).length;
    const skillMatchScore = careerSkills.length > 0 
      ? (skillMatchCount / careerSkills.length) * 100 
      : 0;
    
    // Calculate interest match score
    const careerTags = career.tags.map(tag => tag.toLowerCase());
    const interestMatchCount = careerTags.filter(tag => userInterests.includes(tag)).length;
    const interestMatchScore = careerTags.length > 0 
      ? (interestMatchCount / careerTags.length) * 100 
      : 0;
    
    // Calculate education match score
    const educationMatchScore = career.educationRequirements.some(req => 
      userEducation.some(edu => 
        edu.fieldOfStudy.includes(req.fieldOfStudy?.toLowerCase() || '') || 
        req.fieldOfStudy?.toLowerCase().includes(edu.fieldOfStudy || '')
      )
    ) ? 100 : 0;
    
    // Calculate overall relevance score (weighted average)
    const relevanceScore = Math.round(
      (skillMatchScore * 0.5) + 
      (interestMatchScore * 0.3) + 
      (educationMatchScore * 0.2)
    );
    
    return {
      _id: career._id,
      title: career.title,
      description: career.description,
      industry: career.industry,
      relevanceScore,
      salaryInfo: career.salaryInfo,
      jobGrowth: career.jobGrowth,
      skills: career.skills,
      tags: career.tags
    };
  });
  
  // Sort by relevance score and take top 10
  const topRecommendations = recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);
  
  res.status(200).json({
    success: true,
    count: topRecommendations.length,
    data: topRecommendations
  });
});

// @desc    Get personalized education recommendations
// @route   GET /api/v1/recommendations/education
// @access  Private
exports.getEducationRecommendations = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Extract user career goals, interests, and current education
  const careerGoals = user.careerGoals.preferredRoles.map(role => role.toLowerCase());
  const userInterests = user.interests.flatMap(interest => 
    [interest.category.toLowerCase(), ...interest.subcategories.map(sub => sub.toLowerCase())]
  );
  const currentEducation = user.education.map(edu => ({
    degree: edu.degree.toLowerCase(),
    fieldOfStudy: edu.fieldOfStudy.toLowerCase()
  }));
  
  // Find educational programs
  const educationalPrograms = await Education.find({});
  
  // Calculate relevance score for each program
  const recommendations = educationalPrograms.map(program => {
    // Calculate career alignment score
    const programTags = program.tags.map(tag => tag.toLowerCase());
    const careerAlignmentCount = programTags.filter(tag => careerGoals.includes(tag)).length;
    const careerAlignmentScore = careerGoals.length > 0 
      ? (careerAlignmentCount / careerGoals.length) * 100 
      : 0;
    
    // Calculate interest match score
    const interestMatchCount = programTags.filter(tag => userInterests.includes(tag)).length;
    const interestMatchScore = programTags.length > 0 
      ? (interestMatchCount / programTags.length) * 100 
      : 0;
    
    // Calculate education progression score (higher score for next level of education)
    let educationProgressionScore = 50; // Default middle score
    
    const degreeProgression = {
      'high school': 1,
      'certificate': 2,
      'associate': 3,
      'bachelor': 4,
      'master': 5,
      'doctorate': 6,
      'professional': 6
    };
    
    const highestCurrentDegree = currentEducation.length > 0
      ? Math.max(...currentEducation.map(edu => degreeProgression[edu.degree] || 0))
      : 0;
      
    const programDegreeLevel = degreeProgression[program.degree.toLowerCase()] || 0;
    
    if (programDegreeLevel === highestCurrentDegree + 1) {
      educationProgressionScore = 100; // Perfect next step
    } else if (programDegreeLevel > highestCurrentDegree) {
      educationProgressionScore = 75; // Future step
    } else if (programDegreeLevel === highestCurrentDegree) {
      educationProgressionScore = 50; // Same level, different field perhaps
    } else {
      educationProgressionScore = 25; // Lower level than current education
    }
    
    // Calculate overall relevance score (weighted average)
    const relevanceScore = Math.round(
      (careerAlignmentScore * 0.4) + 
      (interestMatchScore * 0.3) + 
      (educationProgressionScore * 0.3)
    );
    
    return {
      _id: program._id,
      name: program.name,
      institution: program.institution,
      degree: program.degree,
      fieldOfStudy: program.fieldOfStudy,
      description: program.description,
      duration: program.duration,
      format: program.format,
      tuition: program.tuition,
      careerOutcomes: program.careerOutcomes,
      relevanceScore,
      tags: program.tags
    };
  });
  
  // Sort by relevance score and take top 10
  const topRecommendations = recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);
  
  res.status(200).json({
    success: true,
    count: topRecommendations.length,
    data: topRecommendations
  });
});

// @desc    Get personalized skill recommendations
// @route   GET /api/v1/recommendations/skills
// @access  Private
exports.getSkillRecommendations = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Extract user current skills, career goals, and interests
  const userSkills = user.skills.map(skill => skill.name.toLowerCase());
  const careerGoals = user.careerGoals.preferredRoles.map(role => role.toLowerCase());
  const userInterests = user.interests.flatMap(interest => 
    [interest.category.toLowerCase(), ...interest.subcategories.map(sub => sub.toLowerCase())]
  );
  
  // Find skills
  const skills = await Skill.find({});
  
  // Calculate relevance score for each skill
  const recommendations = skills
    // Filter out skills the user already has
    .filter(skill => !userSkills.includes(skill.name.toLowerCase()))
    .map(skill => {
      // Calculate career alignment score
      const skillCareers = skill.careers.map(career => career.toString());
      const careerAlignmentScore = skillCareers.length > 0 ? 50 : 0; // Basic score, would be enhanced with actual career data
      
      // Calculate market value score
      const marketValueScore = skill.marketValue?.demandScore || 0;
      
      // Calculate interest alignment score
      const skillTags = skill.tags.map(tag => tag.toLowerCase());
      const interestMatchCount = skillTags.filter(tag => userInterests.includes(tag)).length;
      const interestAlignmentScore = skillTags.length > 0 
        ? (interestMatchCount / skillTags.length) * 100 
        : 0;
      
      // Calculate skill relationship score (how related to existing skills)
      const relatedSkillsCount = skill.relatedSkills.filter(relatedSkill => 
        userSkills.includes(relatedSkill.toString().toLowerCase())
      ).length;
      const skillRelationshipScore = skill.relatedSkills.length > 0 
        ? (relatedSkillsCount / skill.relatedSkills.length) * 100 
        : 0;
      
      // Calculate overall relevance score (weighted average)
      const relevanceScore = Math.round(
        (careerAlignmentScore * 0.3) + 
        (marketValueScore * 0.3) + 
        (interestAlignmentScore * 0.2) + 
        (skillRelationshipScore * 0.2)
      );
      
      return {
        _id: skill._id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        marketValue: skill.marketValue,
        learningDifficulty: skill.learningDifficulty,
        timeToLearn: skill.timeToLearn,
        learningResources: skill.learningResources.slice(0, 3), // Just include top 3 resources
        relevanceScore,
        tags: skill.tags
      };
    });
  
  // Sort by relevance score and take top 10
  const topRecommendations = recommendations
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);
  
  res.status(200).json({
    success: true,
    count: topRecommendations.length,
    data: topRecommendations
  });
});

// @desc    Save a recommendation
// @route   POST /api/v1/recommendations/save
// @access  Private
exports.saveRecommendation = asyncHandler(async (req, res, next) => {
  const { type, itemId } = req.body;
  
  if (!type || !itemId) {
    return next(new ErrorResponse('Please provide recommendation type and item ID', 400));
  }
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Validate that the item exists
  let itemExists = false;
  
  switch (type) {
    case 'career':
      itemExists = await Career.exists({ _id: itemId });
      if (itemExists) {
        // Check if already saved
        const alreadySaved = user.savedItems.careers.includes(itemId);
        if (!alreadySaved) {
          user.savedItems.careers.push(itemId);
        }
      }
      break;
    case 'education':
      itemExists = await Education.exists({ _id: itemId });
      if (itemExists) {
        // Check if already saved
        const alreadySaved = user.savedItems.educationalPrograms.includes(itemId);
        if (!alreadySaved) {
          user.savedItems.educationalPrograms.push(itemId);
        }
      }
      break;
    case 'skill':
      itemExists = await Skill.exists({ _id: itemId });
      if (itemExists) {
        // Check if already saved
        const alreadySaved = user.savedItems.skills.includes(itemId);
        if (!alreadySaved) {
          user.savedItems.skills.push(itemId);
        }
      }
      break;
    default:
      return next(new ErrorResponse('Invalid recommendation type', 400));
  }
  
  if (!itemExists) {
    return next(new ErrorResponse(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`, 404));
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.savedItems
  });
});

// @desc    Get saved recommendations
// @route   GET /api/v1/recommendations/saved
// @access  Private
exports.getSavedRecommendations = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate('savedItems.careers')
    .populate('savedItems.educationalPrograms')
    .populate('savedItems.skills');
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user.savedItems
  });
});
