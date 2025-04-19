const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
    required: true,
  },
  order: {
    type: Number,
    default: 0, // To control the order of modules within a course
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Module', ModuleSchema);