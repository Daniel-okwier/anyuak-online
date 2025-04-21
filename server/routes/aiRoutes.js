const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * @route    POST /api/ai/generate-quiz
 * @desc      Generate a quiz using OpenAI based on topic, number of questions, and difficulty.
 * @access    Public (removed auth and authorize middleware)
 */
router.post('/generate-quiz', aiController.generateQuiz);

/**
 * @route    POST /api/ai/summarize-text
 * @desc      Summarize the provided text using OpenAI.
 * @access    Public (removed auth middleware)
 */
router.post('/summarize-text', aiController.summarizeText);

module.exports = router;