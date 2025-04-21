const User = require('../models/user');
const TeacherRequest = require('../models/teacherRequests');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ registrationDate: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true, role: 'teacher' }, // Ensure role is also updated
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Optionally update the TeacherRequest status as well
    await TeacherRequest.findOneAndUpdate({ userId: userId }, { status: 'approved' });

    res.json({ msg: `Teacher ${user.name} approved successfully`, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid User ID' });
    }
    res.status(500).send('Server error');
  }
};

exports.rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: false, role: 'student' }, // Revert role if rejected
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Optionally update the TeacherRequest status as well
    await TeacherRequest.findOneAndUpdate({ userId: userId }, { status: 'rejected' });

    res.json({ msg: `Teacher ${user.name} rejected`, user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid User ID' });
    }
    res.status(500).send('Server error');
  }
};

// New functions for handling teacher requests
exports.approveTeacherRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await TeacherRequest.findById(requestId).populate('userId');
    if (!request) {
      return res.status(404).json({ msg: 'Teacher request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request is not pending.' });
    }

    // Update the user's role and approval status
    await User.findByIdAndUpdate(request.userId._id, { role: 'teacher', isApproved: true });

    // Update the teacher request status
    request.status = 'approved';
    await request.save();

    res.json({ msg: `Teacher ${request.userId.name} approved.`, request });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Request ID' });
    }
    res.status(500).send('Server error');
  }
};

exports.rejectTeacherRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await TeacherRequest.findById(requestId).populate('userId');
    if (!request) {
      return res.status(404).json({ msg: 'Teacher request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ msg: 'Request is not pending.' });
    }

    // Optionally, you might want to update the user's role back to 'student' and isApproved to false
    await User.findByIdAndUpdate(request.userId._id, { role: 'student', isApproved: false });

    // Update the teacher request status
    request.status = 'rejected';
    await request.save();

    res.json({ msg: `Teacher ${request.userId.name} rejected.`, request });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Request ID' });
    }
    res.status(500).send('Server error');
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await TeacherRequest.find({ status: 'pending' }).populate('userId', 'name email'); // Populate user details
    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
