const Course = require('../models/course');

// @desc    Create a new course (protected, admin or approved teacher)
// @route   POST /api/courses
// @access  Private (Admin, Teacher)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;
    const instructor = req.user.id; // Get the ID of the logged-in user

    const newCourse = new Course({
      title,
      description,
      instructor,
      category,
      thumbnail,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all courses (public) - with optional filtering by title and instructor name
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
    const course = await Course.findById(req.params.courseId).populate('instructor', 'name');
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

// @desc    Update a course by ID (protected, admin or approved teacher - instructor only or admin)
// @route   PUT /api/courses/:courseId
// @access  Private (Admin, Teacher)
exports.updateCourse = async (req, res) => {
  const { title, description, category, thumbnail } = req.body;

  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if the logged-in user is the instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update this course' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.thumbnail = thumbnail || course.thumbnail;

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

    await course.remove();
    res.json({ msg: 'Course deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
};