const express = require('express');
const { createMentorProfile, getMentorProfile, updateMentorProfile } = require('../controllers/mentorProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', createMentorProfile);
router.get('/', getMentorProfile);
router.put('/', updateMentorProfile);

module.exports = router;