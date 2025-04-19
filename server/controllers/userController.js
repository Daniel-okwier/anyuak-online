// controllers/userController.js
const User = require('../models/user');

// @desc    Get current user profile (protected)
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user profile (protected)
// @route   PUT /api/users/:userId
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { name, bio /* add other profile fields here */ } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Ensure the logged-in user is updating their own profile (basic check)
    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this profile' });
    }

    if (name) user.name = name;
    if (bio) user.profile.bio = bio;
    // Update other profile fields as needed

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};