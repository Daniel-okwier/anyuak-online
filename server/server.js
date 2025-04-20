require('dotenv').config({ path: '../.env' });
const express = require('express');
const connectDB = require('./utils/db');
const config = require('./config/config');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express(); 
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).send('Internal Server Error');
});

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courseRoutes');

// Connect to the database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});