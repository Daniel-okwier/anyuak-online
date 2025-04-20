const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
  type: {
    type: String,
    enum: ['video', 'youtube', 'document', 'quiz'], 
    required: true,
  },
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  videoUrl: String,
  youtubeUrl: String,
  documentUrl: String,
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Reference to a Quiz model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Content', ContentSchema);