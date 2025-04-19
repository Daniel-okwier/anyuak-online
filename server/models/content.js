const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
        index: true, // For efficient querying by module
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'youtube'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    text: String, // For text content
    imageUrl: String, // For image URLs
    videoUrl: String, // For general video URLs/paths
    youtubeUrl: String, // Specifically for YouTube URLs
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Content', ContentSchema);