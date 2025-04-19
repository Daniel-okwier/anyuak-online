const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    // Add user from payload to request object
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is approved
    if (!user.isApproved) {
      return res.status(401).json({ msg: 'Account not yet approved' });
    }

    req.user = user;
    req.user.role = decoded.user.role; // Ensure role is also accessible
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};