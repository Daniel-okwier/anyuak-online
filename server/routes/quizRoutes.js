const express = require('express');
const router = express.Router({ mergeParams: true });
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', auth, authorize(['admin', 'teacher']), quizController.addQuiz);
router.get('/:quizId', auth, authorize(['student', 'teacher', 'admin']), quizController.getQuiz);
router.post('/:quizId/submit', auth, authorize(['student']), quizController.submitQuiz);

module.exports = router;