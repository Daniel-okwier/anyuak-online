// controllers/userController.js
const User = require('../models/user');


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateUserProfile = async (req, res) => {
  const { name, bio  } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

  
    if (user.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this profile' });
    }

    if (name) user.name = name;
    if (bio) user.profile.bio = bio;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};