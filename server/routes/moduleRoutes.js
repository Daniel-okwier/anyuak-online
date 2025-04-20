const express = require('express');
const router = express.Router({ mergeParams: true });
const contentRoutes = require('./contentRoutes');
const quizRoutes = require('./quizRoutes');

router.use('/content', contentRoutes);
router.use('/quizzes', quizRoutes);

module.exports = router;