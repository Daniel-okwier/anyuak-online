const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the instructor
  },
  thumbnail: {
    type: String, // You can store the URL or path to the thumbnail image
  },
  category: {
    type: String,
    // You might want to define an enum of valid categories later
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You might want to add other metadata like tags, difficulty level, etc. in the future
});

module.exports = mongoose.model('Course', CourseSchema);