const Course = require('../models/course');
const Module = require('../models/module');
const User = require('../models/user');
const contentController = require('../controllers/contentController');

// @desc    Create a new course with a thumbnail (protected, admin or approved teacher)
// @route   POST /api/courses
// @access  Private (Admin, Teacher)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const instructor = req.user.id;
    let thumbnailPath = null;

    if (req.file) {
      thumbnailPath = req.file.path;
    }

    const newCourse = new Course({
      title,
      description,
      instructor,
      category,
      thumbnail: thumbnailPath,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all courses (public) - with optional filtering
// @route   GET /api/courses
// @access  Public
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

// @desc    Get a specific course by ID (public)
// @route   GET /api/courses/:courseId
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name').populate('modules', 'title order _id'); // Populate modules
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

// @desc    Update a course by ID (protected, admin or instructor)
// @route   PUT /api/courses/:courseId
// @access  Private (Admin, Teacher)
exports.updateCourse = async (req, res) => {
  const { title, description, category } = req.body;
  let thumbnailPath = req.body.thumbnail;

  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update this course' });
    }

    if (req.file) {
      thumbnailPath = req.file.path;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.thumbnail = thumbnailPath || course.thumbnail;

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

// @desc    Delete a course by ID (protected, admin only)
// @route   DELETE /api/courses/:courseId
// @access  Private (Admin)
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

// @desc    Create a new module for a course
// @route   POST /api/courses/:courseId/modules
// @access  Private (teachers, admins associated with the course)
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
      order: order || 0, // Default order to 0 if not provided
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

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
// @access  Public
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

// @desc    Get a specific module by ID
// @route   GET /api/courses/:courseId/modules/:moduleId
// @access  Public
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

// @desc    Update a specific module
// @route   PUT /api/courses/:courseId/modules/:moduleId
// @access  Private (teachers, admins associated with the course)
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

// @desc    Delete a specific module
// @route   DELETE /api/courses/:courseId/modules/:moduleId
// @access  Private (teachers, admins associated with the course)
exports.deleteModule = async (req, res) => {
  const { courseId, moduleId } = req.params;

  try {
    const course = await Course.findById(courseId);
    const module = await Module.findById(moduleId);

    if (!course || !module) {
      return res.status(404).json({ msg: 'Course or Module not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete modules from this course' });
    }

    if (module.course.toString() !== courseId) {
      return res.status(400).json({ msg: 'Module does not belong to this course' });
    }

    await Module.findByIdAndDelete(moduleId);

    course.modules = course.modules.filter(
      (moduleRef) => moduleRef.toString() !== moduleId
    );
    await course.save();

    res.json({ msg: 'Module deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Module not found' });
    }
    res.status(500).send('Server error');
  }
};