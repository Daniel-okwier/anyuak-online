const Course = require('../models/course');
const Module = require('../models/module');
const Content = require('../models/content');
const Progress = require('../models/progress');


exports.getNextRecommendedContent = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        const course = await Course.findById(courseId).populate({
            path: 'modules',
            populate: {
                path: 'content',
                options: { sort: { order: 1 } } 
            },
            options: { sort: { order: 1 } } 
        });

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Find the user's progress for this course
        const progress = await Progress.find({ user: userId }).populate('content');

        // Helper function to check if content is completed by the user
        const isContentCompleted = (contentId) => {
            return progress.some(p => p.content._id.toString() === contentId.toString() && p.isCompleted);
        };

        // Iterate through modules and their content to find the first incomplete item
        for (const module of course.modules) {
            for (const content of module.content) {
                if (!isContentCompleted(content._id)) {
                    return res.json({ nextContent: content });
                }
            }
        }

        // If all content is completed
        res.json({ message: 'Course completed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};