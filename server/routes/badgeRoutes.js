const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/**
 * @route   GET /api/badges
 * @desc    Get all badges
 * @access  Public (or optionally Authenticated)
 */
router.get('/', badgeController.getAllBadges);

/**
 * @route   POST /api/badges
 * @desc    Create a new badge
 * @access  Admin
 */
router.post('/', auth, authorize(['admin']), badgeController.createBadge);

/**
 * @route   GET /api/badges/me
 * @desc    Get the badges of the currently logged-in user
 * @access  Authenticated
 */
router.get('/me', auth, badgeController.getUserBadges);

// The logic for awarding badges is typically handled internally by other controllers.
// However, for testing or administrative purposes, you could use the following route:
/**
 * @route   POST /api/badges/award/:userId/:badgeCriteria
 * @desc    Award a specific badge to a user (for testing/admin purposes)
 * @access  Admin
 */
// router.post('/award/:userId/:badgeCriteria', auth, authorize(['admin']), async (req, res) => {
//     try {
//         await badgeController.awardBadge(req.params.userId, req.params.badgeCriteria);
//         res.json({ msg: 'Badge awarded successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ msg: 'Error awarding badge', error: err.message });
//     }
// });

module.exports = router;