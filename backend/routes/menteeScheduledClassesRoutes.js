const express = require('express');
const router = express.Router();
const { getConnectedMentorsAndClasses } = require('../controllers/menteeScheduledClassesController');
const { protect } = require('../middleware/authMiddleware'); // Adjust the path as needed

// Route to get connected mentors and their classes for a mentee
router.get('/mentors-and-classes', protect, getConnectedMentorsAndClasses);

module.exports = router;