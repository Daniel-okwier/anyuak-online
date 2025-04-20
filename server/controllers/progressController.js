// server/controllers/progressController.js
const Progress = require('../models/progress');
const Content = require('../models/content');
const Module = require('../models/module');
const pointController = require('./pointController');
const badgeController = require('./badgeController'); 
const Course = require('../models/course');


exports.markContentComplete = async (req, res) => {
    const { contentId } = req.params;
    const userId = req.user.id;

    try {
        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        let progress = await Progress.findOne({ user: userId, content: contentId });

        if (!progress) {
            progress = new Progress({
                user: userId,
                content: contentId,
                isCompleted: true,
                completedAt: Date.now(),
            });
            // Award points for completing content
            pointController.awardPoints(userId, 'content_completed', 10); 
        } else if (!progress.isCompleted) {
            progress.isCompleted = true;
            progress.completedAt = Date.now();
            progress.updatedAt = Date.now();
            // Award points for completing content (if not already completed)
            pointController.awardPoints(userId, 'content_completed', 10); 
        }

        await progress.save();
        res.json({ msg: 'Content marked as complete' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getUserCourseProgress = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        const course = await Course.findById(courseId).populate({
            path: 'modules',
            populate: {
                path: 'content',
            }
        });

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const modules = course.modules;
        let allContentCompleted = true;

        for (const module of modules) {
            const contentInModule = await Content.find({ module: module._id });
            for (const content of contentInModule) {
                const progress = await Progress.findOne({ user: userId, content: content._id });
                if (!progress || !progress.isCompleted) {
                    allContentCompleted = false;
                    break;
                }
            }
            if (!allContentCompleted) break;
        }

        if (allContentCompleted) {
            // Award a badge for completing the course
            badgeController.awardBadge(userId, `complete_course_${courseId}`);
        }

        const progress = await Progress.find({ user: userId, content: { $in: course.modules.flatMap(m => m.content) } });
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getUserModuleProgress = async (req, res) => {
    const { moduleId } = req.params;
    const userId = req.user.id;

    try {
        const content = await Content.find({ module: moduleId }).select('_id');
        const progress = await Progress.find({ user: userId, content: { $in: content } });
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};