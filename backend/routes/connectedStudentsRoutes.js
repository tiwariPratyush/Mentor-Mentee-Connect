const express = require('express');
const router = express.Router();
const { getConnectedStudents } = require('../controllers/connectedStudentsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.get('/', getConnectedStudents);

module.exports = router;