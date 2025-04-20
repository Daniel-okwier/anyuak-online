const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');

// @route   GET /api/recommendation/course/:courseId
// @desc    Get the next recommended content for a specific course
// @access  Private (students)
router.get('/course/:courseId', auth, recommendationController.getNextRecommendedContent);

module.exports = router;