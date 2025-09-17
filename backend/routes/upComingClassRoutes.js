const express = require('express');
const router = express.Router();
const upcomingClassesController = require('../controllers/upComingClassesController');
const { protect } = require('../middleware/authMiddleware'); // Adjust the path and import as needed

// Apply auth middleware to all routes
router.use(protect);

router.post('/schedule', upcomingClassesController.scheduleClass);
router.get('/', upcomingClassesController.getUpcomingClasses);
router.delete('/:classId', upcomingClassesController.deleteClass);

module.exports = router;