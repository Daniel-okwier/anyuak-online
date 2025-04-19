const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const courseController = require('../controllers/courseController');

// @route   POST /api/courses
// @desc    Create a new course (protected, admin or approved teacher)
// @access  Private (Admin, Teacher)
router.post('/', auth, authorize(['admin', 'teacher']), courseController.createCourse);

// @route   GET /api/courses
// @desc    Get all courses (public)
// @access  Public
router.get('/', courseController.getAllCourses);

// @route   GET /api/courses/:courseId
// @desc    Get a specific course by ID (public)
// @access  Public
router.get('/:courseId', courseController.getCourseById);

// @route   PUT /api/courses/:courseId
// @desc    Update a course by ID (protected, admin or approved teacher - instructor only or admin)
// @access  Private (Admin, Teacher)
router.put('/:courseId', auth, authorize(['admin', 'teacher']), courseController.updateCourse);

// @route   DELETE /api/courses/:courseId
// @desc    Delete a course by ID (protected, admin only)
// @access  Private (Admin)
router.delete('/:courseId', auth, authorize(['admin']), courseController.deleteCourse);

module.exports = router;