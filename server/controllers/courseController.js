const Course = require('../models/course');
const Module = require('../models/module');
const User = require('../models/user');

exports.createCourse = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const instructor = req.user.id;

        const newCourse = new Course({
            title,
            description,
            instructor,
            category,
        });

        const course = await newCourse.save();
        res.status(201).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const { title, instructorName } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (instructorName) {
            const users = await User.find({ name: { $regex: instructorName, $options: 'i' } }).select('_id');
            const instructorIds = users.map(user => user._id);
            query.instructor = { $in: instructorIds };
        }

        const courses = await Course.find(query).populate('instructor', 'name');
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('instructor', 'name').populate({
            path: 'modules',
            select: 'title order _id',
            populate: {
                path: 'content',
                select: 'type title order videoUrl youtubeUrl documentUrl quiz'
            }
        });
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.updateCourse = async (req, res) => {
    const { title, description, category } = req.body;

    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to update this course' });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;

        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Remove associated modules
        await Module.deleteMany({ course: req.params.courseId });

        await course.remove();
        res.json({ msg: 'Course and associated modules deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.createModule = async (req, res) => {
    const { title, order } = req.body;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to add modules to this course' });
        }

        const newModule = new Module({
            course: courseId,
            title,
            order: order || 0,
        });

        const module = await newModule.save();

        course.modules.push(module.id);
        await course.save();

        res.status(201).json(module);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getModulesByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const modules = await Module.find({ course: courseId }).sort({ order: 1 });
        res.json(modules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getModuleById = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ msg: 'Module not found' });
        }
        res.json(module);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Module not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.updateModule = async (req, res) => {
    const { title, order } = req.body;
    const { courseId, moduleId } = req.params;

    try {
        const course = await Course.findById(courseId);
        const module = await Module.findById(moduleId);

        if (!course || !module) {
            return res.status(404).json({ msg: 'Course or Module not found' });
        }

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to update modules in this course' });
        }

        if (module.course.toString() !== courseId) {
            return res.status(400).json({ msg: 'Module does not belong to this course' });
        }

        const updatedModule = await Module.findByIdAndUpdate(
            moduleId,
            { title, order },
            { new: true }
        );

        res.json(updatedModule);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Module not found' });
        }
        res.status(500).send('Server error');
    }
};

exports.deleteModule = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        const module = await Module.findById(req.params.moduleId);
        if (!course || !module) {
            return res.status(404).json({ msg: 'Course or Module not found' });
        }
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to delete modules from this course' });
        }
        if (module.course.toString() !== courseId) {
            return res.status(400).json({ msg: 'Module does not belong to this course' });
        }
        await Module.findByIdAndDelete(req.params.moduleId);
        course.modules = course.modules.filter(moduleId => moduleId.toString() !== req.params.moduleId);
        await course.save();
        // Optionally delete associated content as well
        await Content.deleteMany({ module: req.params.moduleId });
        res.json({ msg: 'Module and associated content deleted successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Module not found' });
        }
        res.status(500).send('Server error');
    }
};