const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // For efficient querying of a user's progress
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
        index: true, // For efficient querying of progress on specific content
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
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

// Ensure that a user can't have multiple progress records for the same content
ProgressSchema.index({ user: 1, content: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);