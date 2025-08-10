const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, avatarData } = req.body;
        
        // Check if user exists
        const existingUser = await req.db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create user
        const result = await req.db.query(
            'INSERT INTO users (email, password_hash, avatar_data) VALUES ($1, $2, $3) RETURNING id, email',
            [email, passwordHash, JSON.stringify(avatarData || {})]
        );
        
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const result = await req.db.query('SELECT id, email, password_hash, avatar_data FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                avatarData: user.avatar_data 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;