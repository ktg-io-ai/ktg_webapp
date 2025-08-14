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

// Save JourneyBook answer
router.post('/journeybook/answer', async (req, res) => {
    try {
        const { avatarId, questionKey, answer } = req.body;
        const { Database } = require('../../config/database');
        
        await Database.saveJourneyBookAnswer(avatarId, questionKey, answer);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving journeybook answer:', error);
        res.status(500).json({ error: 'Failed to save answer' });
    }
});

// Get JourneyBook pages from database
router.get('/journeybook/pages', async (req, res) => {
    try {
        const { Database } = require('../../config/database');
        
        const pages = await Database.query(
            'SELECT id, title, content, image_url, options, question_type FROM journeybook_pages ORDER BY id'
        );
        
        console.log('Loaded pages from database:', pages.length);
        res.json(pages);
    } catch (error) {
        console.error('Error loading journeybook pages:', error);
        res.status(500).json({ error: 'Failed to load pages', details: error.message });
    }
});

// Get JourneyBook answers for avatar
router.get('/journeybook/:avatarId', async (req, res) => {
    try {
        const { avatarId } = req.params;
        const { Database } = require('../../config/database');
        
        const answers = await Database.getJourneyBookAnswers(avatarId);
        
        res.json(answers);
    } catch (error) {
        console.error('Error loading journeybook answers:', error);
        res.status(500).json({ error: 'Failed to load answers' });
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