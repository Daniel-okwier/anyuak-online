const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const courseController = require('../controllers/courseController');
const upload = require('../middleware/upload');
const moduleRoutes = express.Router({ mergeParams: true });
const contentRoutes = express.Router({ mergeParams: true });

// Course routes
router.post('/', auth, authorize(['admin', 'teacher']), upload.single('thumbnail'), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);
router.put('/:courseId', auth, authorize(['admin', 'teacher']), upload.single('thumbnail'), courseController.updateCourse);
router.delete('/:courseId', auth, authorize(['admin']), courseController.deleteCourse);

// Module routes - mounted under /api/courses/:courseId/modules
moduleRoutes.post('/', auth, authorize(['admin', 'teacher']), courseController.createModule);
moduleRoutes.get('/', courseController.getModulesByCourse);
moduleRoutes.get('/:moduleId', courseController.getModuleById);
moduleRoutes.put('/:moduleId', auth, authorize(['admin', 'teacher']), courseController.updateModule);
moduleRoutes.delete('/:moduleId', auth, authorize(['admin', 'teacher']), courseController.deleteModule);

// Content routes - mounted under /api/modules/:moduleId/content
contentRoutes.post('/', auth, authorize(['admin', 'teacher']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), contentController.addContent);
contentRoutes.get('/', contentController.getContentByModule);
contentRoutes.get('/:contentId', contentController.getContentById);
contentRoutes.put('/:contentId', auth, authorize(['admin', 'teacher']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), contentController.updateContent);
contentRoutes.delete('/:contentId', auth, authorize(['admin', 'teacher']), contentController.deleteContent);

// Use the module routes under the /courses/:courseId path
router.use('/:courseId/modules', moduleRoutes);

// Use the content routes under the /modules/:moduleId/content path
router.use('/modules/:moduleId/content', contentRoutes);

module.exports = router;