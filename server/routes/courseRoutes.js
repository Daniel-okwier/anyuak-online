const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  submitQuiz
} = require('../controllers/courseController');
const { protect, teacher } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, teacher, createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, teacher, updateCourse)
  .delete(protect, teacher, deleteCourse);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

// New route for quiz submission
router.route('/:courseId/lessons/:lessonId/quiz')
  .post(protect, submitQuiz);

module.exports = router;