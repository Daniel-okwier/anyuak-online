const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module', // Reference to the Module model
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'youtube'],
    required: true,
  },
  order: {
    type: Number,
    default: 0, // To control the order of content within a module
  },
  text: String,
  imageUrl: String,
  videoUrl: String, // For general video URLs/paths
  youtubeUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', ContentSchema);