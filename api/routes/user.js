const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, email, avatar_data, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update avatar data
router.put('/avatar', authenticateToken, async (req, res) => {
    try {
        const { avatarData } = req.body;
        
        await req.db.query(
            'UPDATE users SET avatar_data = $1 WHERE id = $2',
            [JSON.stringify(avatarData), req.user.userId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

// Save JourneyBook response
router.post('/journeybook', authenticateToken, async (req, res) => {
    try {
        const { questionId, answer } = req.body;
        
        await req.db.query(
            'INSERT INTO journeybook (user_id, question_id, answer) VALUES ($1, $2, $3)',
            [req.user.userId, questionId, answer]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save response' });
    }
});

// Get all users (for admin)
router.get('/all', async (req, res) => {
    try {
        const result = await req.db.query(
            'SELECT id, email, avatar_data, created_at FROM users ORDER BY created_at DESC'
        );
        
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users' });
    }
});

module.exports = router;