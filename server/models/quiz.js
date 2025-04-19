const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module', // Reference to the Module model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: [String],
      correctAnswer: {
        type: String,
        required: true,
      },
      // You might want to add more fields like question type, points, etc.
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', QuizSchema);