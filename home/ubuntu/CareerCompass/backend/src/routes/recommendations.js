const express = require('express');
const { 
  getCareerRecommendations,
  getEducationRecommendations,
  getSkillRecommendations,
  saveRecommendation,
  getSavedRecommendations
} = require('../controllers/recommendations');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes
router.get('/careers', getCareerRecommendations);
router.get('/education', getEducationRecommendations);
router.get('/skills', getSkillRecommendations);
router.post('/save', saveRecommendation);
router.get('/saved', getSavedRecommendations);

module.exports = router;
