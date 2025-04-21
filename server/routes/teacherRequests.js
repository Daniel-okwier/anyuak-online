const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teacherRequestController = require('../controllers/teacherRequestController');

router.post('/request', auth, teacherRequestController.submitRequest);
router.get('/pending', auth, teacherRequestController.getPendingRequests);

module.exports = router;