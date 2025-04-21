const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator'); // Import the check middleware
const auth = require('../middleware/auth');

// Validation middleware for registration
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 8 or more characters'
  ).isLength({ min: 8 }),
];

// Validation middleware for login
const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

// Routes
router.post(
  '/register',
  registerValidation,
  authController.registerUser
); // Use validation middleware
router.post('/login', loginValidation, authController.loginUser); 
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/current-user', auth, authController.getCurrentUser); 
module.exports = router;
