const Badge = require('../models/badge');
const UserBadge = require('../models/userBadge');
const Point = require('../models/point');


exports.getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.createBadge = async (req, res) => {
    const { name, description, imageUrl, criteria, pointsAwarded } = req.body;

    try {
        const newBadge = new Badge({
            name,
            description,
            imageUrl,
            criteria,
            pointsAwarded: pointsAwarded || 0,
        });

        const badge = await newBadge.save();
        res.status(201).json(badge);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Badge name already exists' });
        }
        res.status(500).send('Server error');
    }
};


exports.getUserBadges = async (req, res) => {
    try {
        const userBadges = await UserBadge.find({ user: req.user.id }).populate('badge');
        res.json(userBadges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.awardBadge = async (userId, badgeCriteria) => {
    try {
        const badge = await Badge.findOne({ criteria: badgeCriteria });
        if (badge) {
            const existingUserBadge = await UserBadge.findOne({ user: userId, badge: badge._id });
            if (!existingUserBadge) {
                const newUserBadge = new UserBadge({
                    user: userId,
                    badge: badge._id,
                });
                await newUserBadge.save();
                if (badge.pointsAwarded > 0) {
                    const Point = require('../models/point'); 
                    const newPoint = new Point({
                        user: userId,
                        action: `badge_earned_${badge.name.toLowerCase().replace(/\s+/g, '_')}`,
                        points: badge.pointsAwarded,
                    });
                    await newPoint.save();
                }
                console.log(`Badge "${badge.name}" awarded to user ${userId}`);
            }
        }
    } catch (err) {
        console.error(`Error awarding badge with criteria "${badgeCriteria}" to user ${userId}: ${err.message}`);
    }
};