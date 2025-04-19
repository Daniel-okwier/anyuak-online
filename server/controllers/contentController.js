const Module = require('../models/module');
const Content = require('../models/content');
const Course = require('../models/course'); 

// Helper function to check if a user is authorized for a course
const isAuthorizedForCourse = async (userId, courseId) => {
    const course = await Course.findById(courseId);
    return course && (course.teacher.toString() === userId || course.admin === userId); // Assuming you might have an admin field in Course as well
};

// @desc    Add new content to a module
// @route   POST /api/modules/:moduleId/content
// @access  Private (teachers, admins associated with the course)
exports.addContent = async (req, res) => {
    const { type, title, order, text, imageUrl, videoUrl, youtubeUrl } = req.body;
    const { moduleId } = req.params;

    try {
        const module = await Module.findById(moduleId).populate('course');
        if (!module) {
            return res.status(404).json({ msg: 'Module not found' });
        }

        // Authorization check
        if (!(await isAuthorizedForCourse(req.user.id, module.course))) {
            return res.status(401).json({ msg: 'Not authorized to add content to this module' });
        }

        const newContent = new Content({
            module: moduleId,
            type,
            title,
            order: order || 0,
            text,
            imageUrl: type === 'image' && req.files && req.files.image ? req.files.image[0].path : imageUrl,
            videoUrl: type === 'video' && req.files && req.files.video ? req.files.video[0].path : videoUrl,
            youtubeUrl,
        });

        const content = await newContent.save();

        module.content.push(content.id);
        await module.save();

        res.status(201).json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all content for a module
// @route   GET /api/modules/:moduleId/content
// @access  Public
exports.getContentByModule = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const content = await Content.find({ module: moduleId }).sort({ order: 1 });
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get specific content by ID
// @route   GET /api/modules/:moduleId/content/:contentId
// @access  Public
exports.getContentById = async (req, res) => {
    const { contentId } = req.params;

    try {
        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }
        res.json(content);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Content not found' });
        }
        res.status(500).send('Server error');
    }
};

// @desc    Update specific content
// @route   PUT /api/modules/:moduleId/content/:contentId
// @access  Private (teachers, admins associated with the course)
exports.updateContent = async (req, res) => {
    const { type, title, order, text, imageUrl, videoUrl, youtubeUrl } = req.body;
    const { moduleId, contentId } = req.params;

    try {
        const module = await Module.findById(moduleId).populate('course');
        const content = await Content.findById(contentId);

        if (!module || !content) {
            return res.status(404).json({ msg: 'Module or Content not found' });
        }

        if (!(await isAuthorizedForCourse(req.user.id, module.course))) {
            return res.status(401).json({ msg: 'Not authorized to update content in this module' });
        }

        if (content.module.toString() !== moduleId) {
            return res.status(400).json({ msg: 'Content does not belong to this module' });
        }

        const updatedContentFields = {
            type,
            title,
            order: order || content.order,
            text: type === 'text' ? text : undefined,
            imageUrl: type === 'image' && req.files && req.files.image ? req.files.image[0].path : (type === 'image' ? imageUrl : undefined),
            videoUrl: type === 'video' && req.files && req.files.video ? req.files.video[0].path : (type === 'video' ? videoUrl : undefined),
            youtubeUrl: type === 'youtube' ? youtubeUrl : undefined,
        };

        const updatedContent = await Content.findByIdAndUpdate(contentId, updatedContentFields, { new: true });
        res.json(updatedContent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete specific content
// @route   DELETE /api/modules/:moduleId/content/:contentId
// @access  Private (teachers, admins associated with the course)
exports.deleteContent = async (req, res) => {
    const { moduleId, contentId } = req.params;

    try {
        const module = await Module.findById(moduleId).populate('course');
        const content = await Content.findById(contentId);

        if (!module || !content) {
            return res.status(404).json({ msg: 'Module or Content not found' });
        }

        if (!(await isAuthorizedForCourse(req.user.id, module.course))) {
            return res.status(401).json({ msg: 'Not authorized to delete content from this module' });
        }

        if (content.module.toString() !== moduleId) {
            return res.status(400).json({ msg: 'Content does not belong to this module' });
        }

        await Content.findByIdAndDelete(contentId);

        module.content = module.content.filter(
            (contentRef) => contentRef.toString() !== contentId
        );
        await module.save();

        res.json({ msg: 'Content deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};