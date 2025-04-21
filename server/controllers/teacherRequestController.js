const TeacherRequest = require('../models/teacherRequests');
const User = require('../models/user');

exports.submitRequest = async (req, res) => {
  try {
    const { bio, experience, areasOfInterest } = req.body; 

    const newRequest = new TeacherRequest({
      userId: req.user.id,
      bio,
      experience,
      areasOfInterest,
    });

    await newRequest.save();
    res.status(201).json({ msg: 'Teacher authorization request submitted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await TeacherRequest.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};