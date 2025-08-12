// Enhanced Database Configuration for KTG Framework
// Place this in: ktg_framework/src/api/

const mysql = require('mysql2/promise');

const enhancedDbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'ktg_enhanced',
    charset: 'utf8mb4',
    timezone: 'Z'
};

// Database connection pool
const pool = mysql.createPool(enhancedDbConfig);

// Export for use in your existing API structure
module.exports = {
    pool,
    config: enhancedDbConfig
};