const express = require('express');
const { createMenteeProfile, getMenteeProfile, updateMenteeProfile } = require('../controllers/menteeProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', createMenteeProfile);
router.get('/', getMenteeProfile);
router.put('/', updateMenteeProfile);

module.exports = router;