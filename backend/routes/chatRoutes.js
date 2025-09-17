const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get messages between two users
router.get('/:userId/:otherUserId', chatController.getMessages);

// Send a new message
router.post('/send', chatController.sendMessage);

module.exports = router;