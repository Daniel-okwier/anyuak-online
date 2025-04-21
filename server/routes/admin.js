const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/adminController');
const badgeController = require('../controllers/badgeController');

console.log("adminController:", adminController);
console.log("badgeController:", badgeController);

router.get('/users', auth, authorize(['admin']), adminController.getAllUsers);
router.put('/approve-user/:userId', auth, authorize(['admin']), adminController.approveUser);
router.put('/reject-user/:userId', auth, authorize(['admin']), adminController.rejectUser);

// New routes for handling teacher requests
router.put('/approve-teacher-request/:requestId', auth, authorize(['admin']), adminController.approveTeacherRequest);
router.put('/reject-teacher-request/:requestId', auth, authorize(['admin']), adminController.rejectTeacherRequest);
router.get('/pending-teacher-requests', auth, authorize(['admin']), adminController.getPendingRequests); // Corrected route

router.get('/badges', auth, authorize(['admin']), badgeController.getAllBadges);
router.post('/badges', auth, authorize(['admin']), badgeController.createBadge);

// New route for admin dashboard data
router.get('/dashboard-data', auth, authorize(['admin']), adminController.getDashboardData);

module.exports = router;