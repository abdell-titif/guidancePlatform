const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Career = require('../models/Career');
const MarketInsight = require('../models/MarketInsight');
const Skill = require('../models/Skill');

// @desc    Fetch company details from LinkedIn
// @route   GET /api/v1/linkedin/company/:companyName
// @access  Private
exports.getCompanyDetails = asyncHandler(async (req, res, next) => {
  const { companyName } = req.params;
  
  if (!companyName) {
    return next(new ErrorResponse('Please provide a company name', 400));
  }
  
  try {
    // Use the LinkedIn API data source
    const response = await axios.get(`/api/LinkedIn/get_company_details`, {
      params: {
        username: companyName
      }
    });
    
    if (!response.data.success) {
      return next(new ErrorResponse(`Failed to fetch company details: ${response.data.message}`, 404));
    }
    
    const companyData = response.data.data;
    
    // Transform the data to match our application's format
    const transformedData = {
      name: companyData.name,
      description: companyData.description,
      industry: companyData.industries ? companyData.industries[0] : '',
      specialties: companyData.specialities || [],
      website: companyData.website,
      linkedinUrl: companyData.linkedinUrl,
      logo: companyData.logos && companyData.logos.length > 0 ? companyData.logos[0].url : '',
      employeeCount: companyData.staffCount,
      employeeRange: companyData.staffCountRange,
      followerCount: companyData.followerCount,
      headquarters: companyData.headquarter || {},
      locations: companyData.locations || [],
      crunchbaseUrl: companyData.crunchbaseUrl
    };
    
    // Check if we already have this company in our database as a top employer
    // If so, update the market insights with this data
    const existingInsights = await MarketInsight.find({
      'topEmployers.name': companyData.name
    });
    
    if (existingInsights.length > 0) {
      // Update company information in market insights
      for (const insight of existingInsights) {
        const employerIndex = insight.topEmployers.findIndex(
          employer => employer.name === companyData.name
        );
        
        if (employerIndex !== -1) {
          insight.topEmployers[employerIndex].website = transformedData.website;
          insight.topEmployers[employerIndex].logo = transformedData.logo;
          await insight.save();
        }
      }
    }
    
    // Also check if this company is listed in any career paths
    const existingCareers = await Career.find({
      'topEmployers.name': companyData.name
    });
    
    if (existingCareers.length > 0) {
      // Update company information in careers
      for (const career of existingCareers) {
        const employerIndex = career.topEmployers.findIndex(
          employer => employer.name === companyData.name
        );
        
        if (employerIndex !== -1) {
          career.topEmployers[employerIndex].website = transformedData.website;
          career.topEmployers[employerIndex].logo = transformedData.logo;
          await career.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    return next(new ErrorResponse(`Error fetching company details: ${error.message}`, 500));
  }
});

// @desc    Search for professionals on LinkedIn
// @route   GET /api/v1/linkedin/search/people
// @access  Private
exports.searchPeople = asyncHandler(async (req, res, next) => {
  const { keywords, firstName, lastName, company, school, title, start } = req.query;
  
  if (!keywords && !firstName && !lastName && !company && !school && !title) {
    return next(new ErrorResponse('Please provide at least one search parameter', 400));
  }
  
  try {
    // Use the LinkedIn API data source
    const response = await axios.get(`/api/LinkedIn/search_people`, {
      params: {
        keywords: keywords || '',
        firstName: firstName || '',
        lastName: lastName || '',
        company: company || '',
        keywordSchool: school || '',
        keywordTitle: title || '',
        start: start || '0'
      }
    });
    
    if (!response.data.success) {
      return next(new ErrorResponse(`Failed to search people: ${response.data.message}`, 404));
    }
    
    const peopleData = response.data.data;
    
    res.status(200).json({
      success: true,
      count: peopleData.total,
      data: peopleData.items
    });
  } catch (error) {
    return next(new ErrorResponse(`Error searching people: ${error.message}`, 500));
  }
});

// @desc    Get user profile from LinkedIn
// @route   GET /api/v1/linkedin/profile/:username
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  
  if (!username) {
    return next(new ErrorResponse('Please provide a username', 400));
  }
  
  try {
    // Use the LinkedIn API data source
    const response = await axios.get(`/api/LinkedIn/get_user_profile_by_username`, {
      params: {
        username
      }
    });
    
    if (!response.data.success) {
      return next(new ErrorResponse(`Failed to fetch user profile: ${response.data.message}`, 404));
    }
    
    const profileData = response.data.data;
    
    // Extract skills and experience data to potentially update our skills database
    if (profileData.skills && profileData.skills.length > 0) {
      // For each skill mentioned in the profile, check if we have it in our database
      // If not, consider adding it or updating its market value
      for (const skill of profileData.skills) {
        const skillName = skill.name;
        
        // Check if skill exists in our database
        const existingSkill = await Skill.findOne({ 
          name: { $regex: new RegExp(`^${skillName}$`, 'i') } 
        });
        
        if (existingSkill) {
          // Update market value data if this is a professional in a relevant field
          if (profileData.headline && 
              (profileData.headline.includes('Engineer') || 
               profileData.headline.includes('Developer') || 
               profileData.headline.includes('Manager') || 
               profileData.headline.includes('Director'))) {
            
            // Increment demand score slightly for this mention
            if (existingSkill.marketValue && existingSkill.marketValue.demandScore < 100) {
              existingSkill.marketValue.demandScore += 1;
              await existingSkill.save();
            }
          }
        }
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        name: profileData.firstName + ' ' + profileData.lastName,
        headline: profileData.headline,
        location: profileData.location,
        profileUrl: profileData.url,
        skills: profileData.skills || [],
        experience: profileData.experience || [],
        education: profileData.education || []
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Error fetching user profile: ${error.message}`, 500));
  }
});

// @desc    Get job market insights from LinkedIn data
// @route   GET /api/v1/linkedin/market-insights
// @access  Private
exports.getMarketInsights = asyncHandler(async (req, res, next) => {
  const { industry, region } = req.query;
  
  // First check if we have recent data in our database
  const query = {};
  
  if (industry) {
    query.industry = industry;
  }
  
  if (region) {
    if (region.includes(',')) {
      const [city, state, country] = region.split(',').map(r => r.trim());
      if (city) query['region.city'] = city;
      if (state) query['region.state'] = state;
      if (country) query['region.country'] = country;
    } else {
      // Try to match on any region field
      query.$or = [
        { 'region.city': region },
        { 'region.state': region },
        { 'region.country': region }
      ];
    }
  }
  
  // Only get insights from the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  query.date = { $gte: threeMonthsAgo };
  
  const existingInsights = await MarketInsight.find(query);
  
  if (existingInsights.length > 0) {
    // We have recent data, return it
    return res.status(200).json({
      success: true,
      count: existingInsights.length,
      data: existingInsights
    });
  }
  
  // If we don't have recent data, we would fetch from LinkedIn API
  // For this implementation, we'll return a message that we need to refresh the data
  res.status(200).json({
    success: true,
    message: 'No recent market insights available. Please refresh data.',
    data: []
  });
});
