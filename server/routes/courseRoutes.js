const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const courseController = require('../controllers/courseController');
const upload = require('../middleware/upload');
const moduleRoutes = express.Router({ mergeParams: true });
const contentRoutes = require('./contentRoutes'); // Import content routes
const quizRoutes = require('./quizRoutes'); // Import quiz routes

// Course routes
router.post('/', auth, authorize(['admin', 'teacher']), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);
router.put('/:courseId', auth, authorize(['admin', 'teacher']), courseController.updateCourse);
router.delete('/:courseId', auth, authorize(['admin']), courseController.deleteCourse);

// Module routes (nested under courses)
moduleRoutes.post('/', auth, authorize(['admin', 'teacher']), courseController.createModule);
moduleRoutes.get('/', courseController.getModulesByCourse);
moduleRoutes.get('/:moduleId', courseController.getModuleById);
moduleRoutes.put('/:moduleId', auth, authorize(['admin', 'teacher']), courseController.updateModule);
moduleRoutes.delete('/:moduleId', auth, authorize(['admin', 'teacher']), courseController.deleteModule);

// Mount content routes under /:courseId/modules/:moduleId/content
moduleRoutes.use('/:moduleId/content', contentRoutes);

// Mount quiz routes under /:courseId/modules/:moduleId/quizzes
moduleRoutes.use('/:moduleId/quizzes', quizRoutes);

router.use('/:courseId/modules', moduleRoutes);

module.exports = router;