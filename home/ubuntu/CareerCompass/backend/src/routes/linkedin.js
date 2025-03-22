const express = require('express');
const { 
  getCompanyDetails,
  searchPeople,
  getUserProfile,
  getMarketInsights
} = require('../controllers/linkedin');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes
router.get('/company/:companyName', getCompanyDetails);
router.get('/search/people', searchPeople);
router.get('/profile/:username', getUserProfile);
router.get('/market-insights', getMarketInsights);

module.exports = router;
