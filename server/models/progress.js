const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
    required: true,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module', // Reference to the Module model
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content', // Reference to the Content model
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastViewed: {
    type: Date,
    default: Date.now,
  },
});

ProgressSchema.index({ user: 1, course: 1, module: 1, content: 1 }, { unique: true }); // Ensure a user's progress on a specific content item is unique

module.exports = mongoose.model('Progress', ProgressSchema);