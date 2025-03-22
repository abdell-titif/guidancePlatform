const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Process user message and get chatbot response
// @route   POST /api/v1/chatbot/message
// @access  Private
exports.processMessage = asyncHandler(async (req, res, next) => {
  const { message } = req.body;
  
  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }
  
  try {
    // In a real implementation, we would integrate with a proper NLP service
    // For this prototype, we'll use a simple rule-based approach
    
    // Analyze the message to determine intent
    const intent = analyzeIntent(message);
    
    // Generate appropriate response based on intent
    const response = generateResponse(intent, message, req.user);
    
    // Return the response
    res.status(200).json({
      success: true,
      data: {
        message: response.message,
        suggestions: response.suggestions,
        entities: response.entities
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Error processing message: ${error.message}`, 500));
  }
});

// Helper function to analyze message intent
const analyzeIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Career-related intents
  if (lowerMessage.includes('career') || 
      lowerMessage.includes('job') || 
      lowerMessage.includes('profession') ||
      lowerMessage.includes('work')) {
    
    if (lowerMessage.includes('recommend') || 
        lowerMessage.includes('suggest') || 
        lowerMessage.includes('what career') ||
        lowerMessage.includes('which career')) {
      return 'career_recommendation';
    }
    
    if (lowerMessage.includes('salary') || 
        lowerMessage.includes('pay') || 
        lowerMessage.includes('earn')) {
      return 'career_salary';
    }
    
    if (lowerMessage.includes('growth') || 
        lowerMessage.includes('outlook') || 
        lowerMessage.includes('future')) {
      return 'career_growth';
    }
    
    return 'career_general';
  }
  
  // Education-related intents
  if (lowerMessage.includes('education') || 
      lowerMessage.includes('degree') || 
      lowerMessage.includes('college') ||
      lowerMessage.includes('university') ||
      lowerMessage.includes('school') ||
      lowerMessage.includes('program') ||
      lowerMessage.includes('course')) {
    
    if (lowerMessage.includes('recommend') || 
        lowerMessage.includes('suggest') || 
        lowerMessage.includes('what program') ||
        lowerMessage.includes('which program')) {
      return 'education_recommendation';
    }
    
    if (lowerMessage.includes('cost') || 
        lowerMessage.includes('tuition') || 
        lowerMessage.includes('expensive')) {
      return 'education_cost';
    }
    
    return 'education_general';
  }
  
  // Skill-related intents
  if (lowerMessage.includes('skill') || 
      lowerMessage.includes('learn') || 
      lowerMessage.includes('ability') ||
      lowerMessage.includes('competency')) {
    
    if (lowerMessage.includes('recommend') || 
        lowerMessage.includes('suggest') || 
        lowerMessage.includes('what skill') ||
        lowerMessage.includes('which skill')) {
      return 'skill_recommendation';
    }
    
    if (lowerMessage.includes('develop') || 
        lowerMessage.includes('improve') || 
        lowerMessage.includes('enhance')) {
      return 'skill_development';
    }
    
    return 'skill_general';
  }
  
  // Market-related intents
  if (lowerMessage.includes('market') || 
      lowerMessage.includes('industry') || 
      lowerMessage.includes('trend') ||
      lowerMessage.includes('demand')) {
    
    return 'market_insights';
  }
  
  // Profile-related intents
  if (lowerMessage.includes('profile') || 
      lowerMessage.includes('account') || 
      lowerMessage.includes('my information')) {
    
    return 'profile_management';
  }
  
  // Help or general intents
  if (lowerMessage.includes('help') || 
      lowerMessage.includes('how do i') || 
      lowerMessage.includes('how to')) {
    
    return 'help';
  }
  
  // Greeting intents
  if (lowerMessage.includes('hello') || 
      lowerMessage.includes('hi') || 
      lowerMessage.includes('hey') ||
      lowerMessage.includes('greetings')) {
    
    return 'greeting';
  }
  
  // Fallback intent
  return 'general';
};

// Helper function to generate response based on intent
const generateResponse = (intent, message, user) => {
  const firstName = user ? user.firstName : 'there';
  
  // Default response structure
  const response = {
    message: '',
    suggestions: [],
    entities: []
  };
  
  switch (intent) {
    case 'greeting':
      response.message = `Hello ${firstName}! I'm your Career Compass assistant. I can help you with career recommendations, educational pathways, skill development, and market insights. What would you like to know about today?`;
      response.suggestions = [
        { type: 'question', text: 'What careers match my profile?' },
        { type: 'question', text: 'Recommend educational programs for me' },
        { type: 'question', text: 'What skills should I develop?' },
        { type: 'question', text: 'Show me job market trends' }
      ];
      break;
      
    case 'career_recommendation':
      response.message = `I'd be happy to recommend careers that match your profile, ${firstName}. Based on your skills, interests, and educational background, here are some career paths that might be a good fit for you. You can view more detailed recommendations in the Recommendations dashboard.`;
      response.suggestions = [
        { type: 'action', text: 'View career recommendations', payload: { route: '/recommendations/careers' } },
        { type: 'question', text: 'Tell me more about software engineering' },
        { type: 'question', text: 'What skills do I need for data science?' }
      ];
      response.entities = [
        { type: 'career', id: 'software_engineer', name: 'Software Engineer' },
        { type: 'career', id: 'data_scientist', name: 'Data Scientist' },
        { type: 'career', id: 'product_manager', name: 'Product Manager' }
      ];
      break;
      
    case 'career_salary':
      response.message = `Salary information varies by career, location, experience level, and many other factors. I can provide you with average salary ranges for specific careers. You can also explore more detailed salary data in the Market Insights section.`;
      response.suggestions = [
        { type: 'action', text: 'View salary trends', payload: { route: '/market-insights/salaries' } },
        { type: 'question', text: 'What's the average salary for software engineers?' },
        { type: 'question', text: 'How can I increase my earning potential?' }
      ];
      break;
      
    case 'career_growth':
      response.message = `Understanding career growth and future outlook is important for long-term planning. Different industries and roles have varying growth projections. You can explore detailed job growth data in the Market Insights section.`;
      response.suggestions = [
        { type: 'action', text: 'View job growth trends', payload: { route: '/market-insights/growth' } },
        { type: 'question', text: 'Which careers have the best future outlook?' },
        { type: 'question', text: 'Is software engineering still growing?' }
      ];
      break;
      
    case 'career_general':
      response.message = `I can help you explore various aspects of careers including requirements, day-to-day responsibilities, advancement opportunities, and more. What specific information are you looking for about careers?`;
      response.suggestions = [
        { type: 'question', text: 'What careers match my profile?' },
        { type: 'question', text: 'How much do software engineers earn?' },
        { type: 'question', text: 'What's the job outlook for data scientists?' }
      ];
      break;
      
    case 'education_recommendation':
      response.message = `I'd be happy to recommend educational programs that align with your career goals and interests, ${firstName}. Based on your profile, here are some educational pathways that might be a good fit for you. You can explore more options in the Educational Pathways section.`;
      response.suggestions = [
        { type: 'action', text: 'Explore educational pathways', payload: { route: '/education/pathways' } },
        { type: 'question', text: 'What degree do I need for data science?' },
        { type: 'question', text: 'Are there online programs for UX design?' }
      ];
      response.entities = [
        { type: 'education', id: 'cs_degree', name: 'Computer Science Degree' },
        { type: 'education', id: 'data_science_masters', name: 'Data Science Master's Program' },
        { type: 'education', id: 'ux_design_certificate', name: 'UX Design Certificate' }
      ];
      break;
      
    case 'education_cost':
      response.message = `Educational costs vary widely depending on the institution, program type, location, and available financial aid. I can provide general information about tuition ranges and potential financial assistance options.`;
      response.suggestions = [
        { type: 'action', text: 'Compare program costs', payload: { route: '/education/costs' } },
        { type: 'question', text: 'How much does a CS degree cost?' },
        { type: 'question', text: 'Are there affordable online programs?' }
      ];
      break;
      
    case 'education_general':
      response.message = `I can help you explore various educational options including degree programs, certificates, online courses, and more. What specific information are you looking for about education?`;
      response.suggestions = [
        { type: 'question', text: 'Recommend educational programs for me' },
        { type: 'question', text: 'What's the best degree for software engineering?' },
        { type: 'question', text: 'How long does a master's program take?' }
      ];
      break;
      
    case 'skill_recommendation':
      response.message = `Based on your profile and career interests, ${firstName}, I can recommend skills that would be valuable for you to develop. You can track your skill development progress in the Skills section.`;
      response.suggestions = [
        { type: 'action', text: 'View skill recommendations', payload: { route: '/skills/recommendations' } },
        { type: 'question', text: 'What skills do I need for data science?' },
        { type: 'question', text: 'Which programming languages should I learn?' }
      ];
      response.entities = [
        { type: 'skill', id: 'python', name: 'Python' },
        { type: 'skill', id: 'data_analysis', name: 'Data Analysis' },
        { type: 'skill', id: 'machine_learning', name: 'Machine Learning' }
      ];
      break;
      
    case 'skill_development':
      response.message = `Developing new skills is a great way to enhance your career prospects. I can suggest resources and learning paths for specific skills you're interested in. You can track your progress in the Skill Development Tracker.`;
      response.suggestions = [
        { type: 'action', text: 'Go to skill tracker', payload: { route: '/skills/tracker' } },
        { type: 'question', text: 'How can I learn Python?' },
        { type: 'question', text: 'What's the best way to develop leadership skills?' }
      ];
      break;
      
    case 'skill_general':
      response.message = `Skills are crucial for career success. I can help you identify which skills are in demand, how to develop them, and how they relate to different career paths. What specific information about skills are you looking for?`;
      response.suggestions = [
        { type: 'question', text: 'What skills should I develop?' },
        { type: 'question', text: 'How can I improve my programming skills?' },
        { type: 'question', text: 'Which skills are most in demand?' }
      ];
      break;
      
    case 'market_insights':
      response.message = `Understanding market trends is valuable for career planning. I can provide insights on job growth, salary trends, in-demand skills, and industry developments. You can explore detailed data in the Market Insights section.`;
      response.suggestions = [
        { type: 'action', text: 'View market insights', payload: { route: '/market-insights' } },
        { type: 'question', text: 'What are the fastest growing industries?' },
        { type: 'question', text: 'Which skills are most in demand?' }
      ];
      break;
      
    case 'profile_management':
      response.message = `You can view and update your profile information at any time. Your profile data helps me provide personalized recommendations for careers, education, and skills.`;
      response.suggestions = [
        { type: 'action', text: 'Go to my profile', payload: { route: '/profile' } },
        { type: 'question', text: 'How do I update my skills?' },
        { type: 'question', text: 'Why do you need my education information?' }
      ];
      break;
      
    case 'help':
      response.message = `I'm here to help you navigate Career Compass! I can assist with career recommendations, educational pathways, skill development, and market insights. You can ask me specific questions or use the suggestions below to get started.`;
      response.suggestions = [
        { type: 'question', text: 'What can you help me with?' },
        { type: 'question', text: 'How do I get career recommendations?' },
        { type: 'question', text: 'Where can I see market trends?' },
        { type: 'question', text: 'How do I update my profile?' }
      ];
      break;
      
    case 'general':
    default:
      response.message = `I'm not sure I fully understood your question. As your Career Compass assistant, I can help with career recommendations, educational pathways, skill development, and market insights. Could you rephrase your question or select one of the suggestions below?`;
      response.suggestions = [
        { type: 'question', text: 'What careers match my profile?' },
        { type: 'question', text: 'Recommend educational programs for me' },
        { type: 'question', text: 'What skills should I develop?' },
        { type: 'question', text: 'Show me job market trends' }
      ];
      break;
  }
  
  return response;
};

module.exports = {
  processMessage
};
