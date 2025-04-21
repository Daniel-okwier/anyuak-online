const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator'); 

const ADMIN_CREDENTIAL = process.env.ADMIN_CREDENTIAL;

exports.registerUser = async (req, res) => {
  const { name, email, password, role, adminCredential } = req.body;

  // Input validation using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    let newUserRole = role || 'student';
    let isApproved = false;

    if (newUserRole === 'admin') {
      if (adminCredential === ADMIN_CREDENTIAL) {
        isApproved = true;
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid admin credentials' }] });
      }
    }

    // Create a new user instance
    user = new User({
      name,
      email,
      password,
      role: newUserRole,
      isApproved: isApproved,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        isApproved: user.isApproved, // Include isApproved in the payload
        name: user.name, // Include the user's name
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user }); // Include the user object in the response
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Input validation using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check if the user exists
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        isApproved: user.isApproved, // Include isApproved
        name: user.name,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user }); // Include user data in response
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({
          msg:
            'If an account with this email exists, a reset link has been sent.',
        }); // Don't reveal if email exists
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://localhost:${config.port}/reset-password?token=${resetToken}&email=${user.email}`; 

    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                  <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                  <a href="${resetUrl}">${resetUrl}</a>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ msg: 'Error sending reset email.' });
      }
      res.json({ msg: 'Email sent successfully with password reset link.' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
