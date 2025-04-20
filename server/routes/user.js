const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const pointController = require('../controllers/pointController'); 


router.get('/me', auth, userController.getCurrentUser); 


router.put('/me', auth, userController.updateUserProfile); 


router.get('/me/points', auth, pointController.getUserPoints);

module.exports = router;