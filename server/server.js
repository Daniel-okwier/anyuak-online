const express = require('express');
const connectDB = require('./utils/db');
const config = require('./config/config');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin'); 
const courseRoutes = require('./routes/course');

const app = express();

// Connect to the database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false })); // Allows us to parse JSON request bodies

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