const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// Get leaderboard data
router.get('/', async (req, res) => {
  try {
    const { timeFrame = 'weekly' } = req.query;
    
    // In a real implementation, you would query based on time frame
    // and calculate points based on course completions, quiz scores, etc.
    
    // For now, we'll just get users and add mock points
    const users = await User.find({})
      .select('name avatar role enrolledCourses')
      .limit(10);
    
    // Transform the data for the leaderboard
    const leaderboardData = users.map((user, index) => {
      // Mock data generation
      const points = 1000 - (index * 50) + Math.floor(Math.random() * 30);
      const coursesCompleted = Math.min(8, Math.max(1, Math.floor(Math.random() * 8)));
      const streak = Math.min(21, Math.max(3, Math.floor(Math.random() * 21)));
      
      // Badge calculation based on points
      let badge = 'Bronze';
      if (points > 900) badge = 'Diamond';
      else if (points > 800) badge = 'Platinum';
      else if (points > 600) badge = 'Gold';
      else if (points > 400) badge = 'Silver';
      
      return {
        id: user._id,
        name: user.name,
        avatar: user.avatar || `https://i.pravatar.cc/150?img=${(index + 10)}`,
        role: user.role,
        points,
        coursesCompleted,
        streak,
        rank: index + 1,
        badge
      };
    });
    
    res.json(leaderboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user's leaderboard position
router.get('/me', protect, async (req, res) => {
  try {
    // In a real implementation, you would calculate the actual position
    // For now, we'll just return mock data
    
    const rank = Math.floor(Math.random() * 100) + 1;
    const points = 1000 - (rank * 3) + Math.floor(Math.random() * 50);
    
    res.json({
      rank,
      points,
      total_users: 1245 // Mock total users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;