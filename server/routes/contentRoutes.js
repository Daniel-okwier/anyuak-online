const express = require('express');
const router = express.Router({ mergeParams: true });
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.post('/', auth, authorize(['teacher', 'admin']), upload.fields([
    { name: 'document', maxCount: 1 }, // For document uploads
    { name: 'video', maxCount: 1 },
]), contentController.addContent);

router.get('/', contentController.getContentByModule);
router.get('/:contentId', contentController.getContentById);
router.put('/:contentId', auth, authorize(['teacher', 'admin']), upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), contentController.updateContent);
router.delete('/:contentId', auth, authorize(['teacher', 'admin']), contentController.deleteContent);

module.exports = router;