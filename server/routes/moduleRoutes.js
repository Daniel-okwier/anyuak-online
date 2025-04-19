const express = require('express');
const router = express.Router({ mergeParams: true }); // To access courseId and moduleId

const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload'); // For file uploads

// @route   POST /api/modules/:moduleId/content
// @desc    Add new content to a module
// @access  Private (teachers, admins associated with the course)
router.post('/', auth, authorize(['teacher', 'admin']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), contentController.addContent);

// @route   GET /api/modules/:moduleId/content
// @desc    Get all content for a module
// @access  Public
router.get('/', contentController.getContentByModule);

// @route   GET /api/modules/:moduleId/content/:contentId
// @desc    Get specific content by ID
// @access  Public
router.get('/:contentId', contentController.getContentById);

// @route   PUT /api/modules/:moduleId/content/:contentId
// @desc    Update specific content
// @access  Private (teachers, admins associated with the course)
router.put('/:contentId', auth, authorize(['teacher', 'admin']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), contentController.updateContent);

// @route   DELETE /api/modules/:moduleId/content/:contentId
// @desc    Delete specific content
// @access  Private (teachers, admins associated with the course)
router.delete('/:contentId', auth, authorize(['teacher', 'admin']), contentController.deleteContent);

module.exports = router;