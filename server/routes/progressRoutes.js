const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const progressController = require('../controllers/progressController');

router.post('/content/:contentId/complete', auth, progressController.markContentComplete);
router.get('/courses/:courseId', auth, progressController.getUserCourseProgress);
router.get('/modules/:moduleId', auth, progressController.getUserModuleProgress);

module.exports = router;