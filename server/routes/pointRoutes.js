const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pointController = require('../controllers/pointController');

router.get('/me', auth, pointController.getUserPoints); // Get logged-in user's points

module.exports = router;