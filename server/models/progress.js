const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module', 
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content', 
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

ProgressSchema.index({ user: 1, course: 1, module: 1, content: 1 }, { unique: true }); 

module.exports = mongoose.model('Progress', ProgressSchema);