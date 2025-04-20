const User = require('../models/user');
const QuizSubmission = require('../models/quizSubmission');
const Course = require('../models/course');
const Module = require('../models/module');
const Content = require('../models/content');
const Quiz = require('../models/quiz');
const mongoose = require('mongoose');
const pointController = require('./pointController');


exports.getCourseLeaderboard = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const modules = await Module.find({ course: courseId }).select('_id');
        const quizzes = await Quiz.find({ module: { $in: modules } }).select('_id');

        // Aggregate total points for each user in the course
        const pointsAggregation = Point.aggregate([
            {
                $match: {
                    action: { $in: ['content_completed', 'quiz_passed'] }
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalPoints: { $sum: '$points' }
                }
            }
        ]).exec();

        // Aggregate average quiz score percentage for each user in the course
        const quizAggregation = QuizSubmission.aggregate([
            {
                $match: {
                    quiz: { $in: quizzes }
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quiz',
                    foreignField: '_id',
                    as: 'quizData'
                }
            },
            {
                $unwind: '$quizData'
            },
            {
                $group: {
                    _id: '$user',
                    averageQuizScore: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$score', '$quizData.questions.length'] },
                                100
                            ]
                        }
                    },
                    quizzesTaken: { $sum: 1 }
                }
            }
        ]).exec();

        const [pointsResult, quizResult] = await Promise.all([pointsAggregation, quizAggregation]);

        // Combine the results
        const userScores = {};

        pointsResult.forEach(p => {
            userScores[p._id] = { totalPoints: p.totalPoints, averageQuizScore: 0, quizzesTaken: 0 };
        });

        quizResult.forEach(q => {
            if (userScores[q._id]) {
                userScores[q._id].averageQuizScore = q.averageQuizScore || 0;
                userScores[q._id].quizzesTaken = q.quizzesTaken;
            } else {
                userScores[q._id] = { totalPoints: 0, averageQuizScore: q.averageQuizScore || 0, quizzesTaken: q.quizzesTaken };
            }
        });

        // Fetch user names and format the leaderboard data
        const leaderboardData = await User.aggregate([
            {
                $match: { _id: { $in: Object.keys(userScores).map(id => mongoose.Types.ObjectId(id)) } }
            },
            {
                $project: { _id: 1, name: 1 }
            },
            {
                $addFields: {
                    finalScore: {
                        $add: [
                            '$totalPoints',
                            { $multiply: ['$averageQuizScore', 5] }
                        ]
                    },
                    totalPoints: { $ifNull: [{$toInt: '$totalPoints'}, 0] },
                    averageQuizScore: { $ifNull: ['$averageQuizScore', 0] },
                    quizzesTaken: { $ifNull: ['$quizzesTaken', 0] }
                }
            },
            {
                $sort: { finalScore: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Merge with calculated scores
        const finalLeaderboard = leaderboardData.map(user => ({
            _id: user._id,
            name: user.name,
            totalPoints: user.totalPoints,
            averageQuizScore: parseFloat(user.averageQuizScore.toFixed(2)),
            quizzesTaken: user.quizzesTaken,
            finalScore: parseFloat(user.finalScore.toFixed(2))
        }));

        res.json(finalLeaderboard);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getCourseQuizLeaderboard = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const modules = await Module.find({ course: courseId }).select('_id');
        const quizzes = await Quiz.find({ module: { $in: modules } }).select('_id');

        // Aggregate average quiz scores for each user in the course
        const quizAggregation = await QuizSubmission.aggregate([
            {
                $match: {
                    quiz: { $in: quizzes }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $group: {
                    _id: '$user',
                    name: { $first: '$userData.name' },
                    averageQuizScore: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$score', '$totalQuestions'] },
                                100
                            ]
                        }
                    },
                    quizzesTaken: { $sum: 1 }
                }
            },
            {
                $sort: { averageQuizScore: -1 }
            },
            {
                $limit: 10
            }
        ]).exec();

        res.json(quizAggregation);
    } catch (error) {
        console.error("Error fetching course quiz leaderboard:", error);
        res.status(500).json({ message: "Failed to retrieve course quiz leaderboard", error: error.message });
    }
};



exports.getQuizLeaderboard = async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const leaderboardData = await QuizSubmission.aggregate([
            {
                $match: {
                    quiz: mongoose.Types.ObjectId(quizId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project: {
                    _id: 0,
                    name: '$userData.name',
                    score: 1,
                    totalQuestions: 1,
                    percentage: {
                        $multiply: [
                            { $divide: ['$score', '$totalQuestions'] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { percentage: -1, score: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json(leaderboardData);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid Quiz ID' });
        }
        res.status(500).send('Server error');
    }
};