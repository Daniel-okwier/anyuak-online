const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctAnswer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Question', QuestionSchema);