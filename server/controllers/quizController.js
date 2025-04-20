// server/controllers/quizController.js
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const QuizSubmission = require('../models/quizSubmission');
const Module = require('../models/module');
const Course = require('../models/course');
const pointController = require('./pointController');
const badgeController = require('./badgeController'); 

// Helper function to check if a user is authorized for a course
const isAuthorizedForCourse = async (userId, courseId) => {
    const course = await Course.findById(courseId);
    return course && (course.instructor.toString() === userId || course.admin === userId); 
};


exports.addQuiz = async (req, res) => {
    const { title, description, questions } = req.body;
    const { moduleId } = req.params;

    try {
        const module = await Module.findById(moduleId).populate('course');
        if (!module) {
            return res.status(404).json({ msg: 'Module not found' });
        }

        if (!(await isAuthorizedForCourse(req.user.id, module.course))) {
            return res.status(401).json({ msg: 'Not authorized to add quizzes to this module' });
        }

        const newQuiz = new Quiz({
            module: moduleId,
            title,
            description,
        });

        const quiz = await newQuiz.save();

        // Create and associate questions
        const createdQuestions = await Promise.all(questions.map(async (q) => {
            const newQuestion = new Question({
                quiz: quiz._id,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
            });
            return await newQuestion.save();
        }));

        quiz.questions = createdQuestions.map(q => q._id);
        await quiz.save();

        module.quizzes.push(quiz._id);
        await module.save();

        res.status(201).json(quiz);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getQuiz = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId).populate('questions', 'text options');
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        if (req.user.role === 'student') {
            const quizData = {
                _id: quiz._id,
                module: quiz.module,
                title: quiz.title,
                description: quiz.description,
                questions: quiz.questions.map(q => ({ _id: q._id, text: q.text, options: q.options })),
                createdAt: quiz.createdAt,
                updatedAt: quiz.updatedAt,
            };
            return res.json(quizData);
        }

        res.json(quiz); 

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Quiz not found' });
        }
        res.status(500).send('Server error');
    }
};


exports.submitQuiz = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body; 

    try {
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const submission = new QuizSubmission({
            user: userId,
            quiz: quizId,
            totalQuestions: quiz.questions.length,
        });

        let score = 0;
        const results = [];

        for (const submittedAnswer of answers) {
            const question = quiz.questions.find(q => q._id.toString() === submittedAnswer.question);
            if (question) {
                const isCorrect = question.correctAnswer === submittedAnswer.selectedAnswer;
                if (isCorrect) {
                    score++;
                }
                results.push({
                    question: question._id,
                    selectedAnswer: submittedAnswer.selectedAnswer,
                    isCorrect,
                });
            }
        }

        submission.answers = results;
        submission.score = score;
        await submission.save();

        const passPercentage = (score / quiz.questions.length) * 100;
        if (passPercentage >= 70) {
            pointController.awardPoints(userId, 'quiz_passed', 50);

            const passedQuizzesCount = await QuizSubmission.countDocuments({ user: userId, quiz: quizId, score: { $gte: quiz.questions.length * 0.7 } });
            badgeController.awardBadge(userId, 'passed_a_quiz');
        }

        res.json(submission);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Quiz not found' });
        }
        res.status(500).send('Server error');
    }
};


exports.getQuizSubmission = async (req, res) => {
    const { submissionId } = req.params;
    const userId = req.user.id;

    try {
        const submission = await QuizSubmission.findById(submissionId).populate('user quiz', 'name title').populate({
            path: 'answers.question',
            select: 'text options correctAnswer explanation'
        });

        if (!submission) {
            return res.status(404).json({ msg: 'Quiz submission not found' });
        }

        // Allow access to the student who submitted, or teachers/admins
        if (submission.user._id.toString() !== userId && req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to view this submission' });
        }

        res.json(submission);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Quiz submission not found' });
        }
        res.status(500).send('Server error');
    }
};