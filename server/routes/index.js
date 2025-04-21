const express = require('express');
const router = express.Router();
const courseRoutes = require('./courseRoutes');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const pointRoutes = require('./pointRoutes');
const badgeRoutes = require('./badgeRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const aiRoutes = require('./aiRoutes');
const progressRoutes = require('./progressRoutes');
const contentRoutes = require('./contentRoutes'); 
const quizRoutes = require('./quizRoutes');   
const teacherRequests = require('./teacherRequests') 

router.use('/api/courses', courseRoutes);
router.use('/api/users', userRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/points', pointRoutes);
router.use('/api/badges', badgeRoutes);
router.use('/api/leaderboard', leaderboardRoutes);
router.use('/api/recommendations', recommendationRoutes);
router.use('/api/ai', aiRoutes);
router.use('/api/progress', progressRoutes);
router.use('/api/teacher-requests', teacherRequests);

module.exports = router;