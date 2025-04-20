const Point = require('../models/point');
console.trace()

exports.getUserPoints = async (req, res) => {
    try {
        const points = await Point.find({ user: req.user.id });
        const totalPoints = points.reduce((sum, p) => sum + p.points, 0);
        res.json({ totalPoints });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.awardPoints = async (userId, action, points) => {
    try {
        const newPoint = new Point({
            user: userId,
            action,
            points,
        });
        await newPoint.save();
    } catch (err) {
        console.error(`Error awarding points for user ${userId}, action ${action}: ${err.message}`);
    }
};