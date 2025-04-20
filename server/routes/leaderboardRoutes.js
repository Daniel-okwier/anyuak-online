const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.get('/courses/:courseId', leaderboardController.getCourseLeaderboard);
router.get('/courses/:courseId/quizzes', leaderboardController.getCourseQuizLeaderboard);
router.get('/quizzes/:quizId', leaderboardController.getQuizLeaderboard);

module.exports = router;