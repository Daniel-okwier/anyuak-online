const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const authorize = require('../middleware/authorize'); // We'll create this next

// @route   GET /api/admin/users
// @desc    Get all users (protected, admin only)
// @access  Private (Admin)
router.get('/users', auth, authorize(['admin']), adminController.getAllUsers);

// @route   PUT /api/admin/approve-user/:userId
// @desc    Approve a user account (protected, admin only)
// @access  Private (Admin)
router.put('/approve-user/:userId', auth, authorize(['admin']), adminController.approveUser);

// @route   PUT /api/admin/reject-user/:userId
// @desc    Reject a user account (protected, admin only)
// @access  Private (Admin)
router.put('/reject-user/:userId', auth, authorize(['admin']), adminController.rejectUser);

module.exports = router;