const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const adminController = require('../controllers/adminController');
const badgeController = require('../controllers/badgeController'); 


router.get('/users', auth, authorize(['admin']), adminController.getAllUsers);


router.put('/approve-user/:userId', auth, authorize(['admin']), adminController.approveUser);


router.put('/reject-user/:userId', auth, authorize(['admin']), adminController.rejectUser);


router.get('/badges', auth, authorize(['admin']), badgeController.getAllBadges);


router.post('/badges', auth, authorize(['admin']), badgeController.createBadge);

module.exports = router;