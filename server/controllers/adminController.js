const User = require('../models/user');

// @desc    Get all users (protected, admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ registrationDate: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Approve a user account (protected, admin only)
// @route   PUT /api/admin/approve-user/:userId
// @access  Private (Admin)
exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true } // Return the updated document
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: `User ${user.name} approved successfully`, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid User ID' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Reject a user account (protected, admin only)
// @route   PUT /api/admin/reject-user/:userId
// @access  Private (Admin)
exports.rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: false }, // Or you could add an 'isRejected' flag
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: `User ${user.name} rejected`, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid User ID' });
    }
    res.status(500).send('Server error');
  }
};