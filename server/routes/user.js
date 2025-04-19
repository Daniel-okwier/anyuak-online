// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/users/me
// @desc    Get current user profile (protected)
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

// @route   PUT /api/users/:userId
// @desc    Update user profile (protected)
// @access  Private
router.put('/:userId', auth, userController.updateUserProfile);

module.exports = router;