const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware
app.use(cors());
app.use(express.json());

// Make database available to routes
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`KTG API server running on port ${port}`);
});