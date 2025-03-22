const express = require('express');
const { processMessage } = require('../controllers/chatbot');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Routes
router.post('/message', processMessage);

module.exports = router;
