const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;