const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/**
 * @route   POST /api/ai/generate-quiz
 * @desc    Generate a quiz using OpenAI based on topic, number of questions, and difficulty.
 * @access  Authenticated (Admin or Teacher)
 */
router.post('/generate-quiz', auth, authorize(['admin', 'teacher']), aiController.generateQuiz);

/**
 * @route   POST /api/ai/summarize-text
 * @desc    Summarize the provided text using OpenAI.
 * @access  Authenticated
 */
router.post('/summarize-text', auth, aiController.summarizeText);

module.exports = router;