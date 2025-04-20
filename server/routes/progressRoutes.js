const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const progressController = require('../controllers/progressController');

// @route   POST /api/progress/content/:contentId/complete
// @desc    Mark a content item as complete for the logged-in user
// @access  Private (students)
router.post('/content/:contentId/complete', auth, progressController.markContentComplete);

// @route   GET /api/progress/course/:courseId
// @desc    Get the logged-in user's progress for a specific course
// @access  Private (students)
router.get('/course/:courseId', auth, progressController.getUserCourseProgress);

// @route   GET /api/progress/module/:moduleId
// @desc    Get the logged-in user's progress for a specific module
// @access  Private (students)
router.get('/module/:moduleId', auth, progressController.getUserModuleProgress);

module.exports = router;