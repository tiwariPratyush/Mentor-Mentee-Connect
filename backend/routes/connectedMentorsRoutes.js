const express = require('express');
const router = express.Router();
const { getConnectedMentors } = require('../controllers/connectedMentorsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.get('/', getConnectedMentors);

module.exports = router;