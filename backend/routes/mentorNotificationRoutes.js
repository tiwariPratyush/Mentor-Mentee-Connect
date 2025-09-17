const express = require('express');
const router = express.Router();
const { 
    createConnectionRequest, 
    getNotificationsOfMentor, 
    updateNotificationStatus 
  } = require('../controllers/mentorNotificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authMiddleware.protect);

// Create a connection request
router.post('/request/:mentorId', createConnectionRequest);


router.get('/mentor', getNotificationsOfMentor);

// Update notification status
router.put('/:notificationId', updateNotificationStatus);



module.exports = router;