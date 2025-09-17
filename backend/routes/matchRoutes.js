const express = require('express');
const { getMatchingMentors } = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/mentors', getMatchingMentors);

module.exports = router;