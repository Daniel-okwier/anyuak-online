const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationController = require('../controllers/recommendationController');


router.get('/course/:courseId', auth, recommendationController.getNextRecommendedContent);

module.exports = router;