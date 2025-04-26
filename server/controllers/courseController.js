const Course = require('../models/course');
const User = require('../models/user');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category,
      level,
      price,
      thumbnail,
      lessons
    } = req.body;

    // Calculate total duration if lessons are provided
    let totalDuration = 0;
    if (lessons && lessons.length > 0) {
      totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    }

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category,
      level,
      price,
      thumbnail,
      lessons: lessons || [],
      totalDuration
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    
    const category = req.query.category ? { category: req.query.category } : {};
    const level = req.query.level ? { level: req.query.level } : {};
    
    const count = await Course.countDocuments({ ...keyword, ...category, ...level });
    const courses = await Course.find({ ...keyword, ...category, ...level })
      .populate('instructor', 'name avatar')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    
    res.json({
      courses,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('enrolledStudents', 'name avatar');
    
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
    
    // Update course fields
    const { title, description, category, level, price, thumbnail, lessons } = req.body;
    
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.level = level || course.level;
    course.price = price !== undefined ? price : course.price;
    course.thumbnail = thumbnail || course.thumbnail;
    
    // Update lessons if provided
    if (lessons) {
      course.lessons = lessons;
      // Recalculate total duration
      course.totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    }
    
    course.updatedAt = Date.now();
    
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    
    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!course || !user) {
      return res.status(404).json({ message: 'Course or user not found' });
    }
    
    // Check if user is already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Add user to course's enrolled students
    course.enrolledStudents.push(req.user._id);
    await course.save();
    
    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    await user.save();
    
    res.status(200).json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers for a lesson
// @route   POST /api/courses/:courseId/lessons/:lessonId/quiz
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid quiz submission format' });
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) {
      return res.status(400).json({ message: 'No quiz available for this lesson' });
    }

    // Check answers and calculate score
    const quizQuestions = lesson.quiz.questions;
    let correctAnswers = 0;

    // Make sure we only check as many answers as there are questions
    const answersToCheck = Math.min(answers.length, quizQuestions.length);
    
    for (let i = 0; i < answersToCheck; i++) {
      if (answers[i] === quizQuestions[i].correctAnswer) {
        correctAnswers++;
      }
    }

    const score = (correctAnswers / quizQuestions.length) * 100;

    // You might want to save the score to the user's record in the future
    // For now, just return the result
    
    res.status(200).json({ 
      score, 
      correctAnswers, 
      totalQuestions: quizQuestions.length,
      passed: score >= 70 // Assuming 70% is passing
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  submitQuiz
};