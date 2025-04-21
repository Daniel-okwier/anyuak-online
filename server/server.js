require('dotenv').config({ path: '../.env' });
const express = require('express');
const connectDB = require('./utils/db');
const config = require('./config/config');
const winston = require('winston');
const routes = require('./routes');
const cors = require('cors'); 

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


app.use(cors());

app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send('Internal Server Error');
});

// Connect to the database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/', routes); // Mount the main router from routes/index.js

app.get('/', (req, res) => res.send('API Running'));

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});