const { Database } = require('./config/database');

async function testDatabase() {
    try {
        // Test connection
        console.log('Testing database connection...');
        
        // Check if users table exists
        const result = await Database.query('SHOW TABLES LIKE "users"');
        console.log('Users table exists:', result.length > 0);
        
        if (result.length === 0) {
            console.log('Creating users table...');
            await Database.query(`
                CREATE TABLE users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    wallet_id VARCHAR(50) UNIQUE NOT NULL,
                    username VARCHAR(50) UNIQUE,
                    first_name VARCHAR(100),
                    last_name VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('Users table created');
        }
        
        // Test user creation
        console.log('Testing user registration...');
        const testUser = {
            email: 'test@ktg.io',
            password_hash: 'test123',
            wallet_id: 'wallet_test_' + Date.now(),
            username: 'testuser',
            first_name: 'Test',
            last_name: 'User'
        };
        
        const insertResult = await Database.createUser(testUser);
        console.log('Test user created with ID:', insertResult.insertId);
        
        // Check if user exists
        const user = await Database.getUserByEmail('test@ktg.io');
        console.log('Retrieved user:', user ? user.email : 'Not found');
        
    } catch (error) {
        console.error('Database test failed:', error.message);
    }
}

testDatabase();