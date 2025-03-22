const express = require('express');
const { 
  searchEducationalPrograms,
  getEducationalProgram,
  getLearningResources,
  getTopInstitutions,
  getEducationStatistics
} = require('../controllers/education');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes
router.get('/search', searchEducationalPrograms);
router.get('/resources/:skillId', getLearningResources);
router.get('/institutions/top', getTopInstitutions);
router.get('/statistics', getEducationStatistics);
router.get('/:id', getEducationalProgram);

module.exports = router;
