const express = require('express');
const { Database } = require('../config/database');
const router = express.Router();

// Create in-game email notification
router.post('/email', async (req, res) => {
    try {
        const { user_id, type, title, content, from_user_id } = req.body;
        
        await Database.query(
            'INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)',
            [user_id, type, title, content]
        );
        
        res.json({ success: true, message: 'Email notification sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user notifications (inbox)
router.get('/inbox/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        
        const notifications = await Database.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        
        res.json({ notifications });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        await Database.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ?',
            [notificationId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete notification
router.delete('/:id', async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        await Database.query(
            'DELETE FROM notifications WHERE id = ?',
            [notificationId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// JourneyBook intimacy request
router.post('/intimacy-request', async (req, res) => {
    try {
        const { requester_id, target_user_id } = req.body;
        
        // Get requester info
        const requester = await Database.getUserById(requester_id);
        
        const title = 'Intimacy Access Request';
        const content = `Avatar ${requester.username} would like to see your Intimate Preferences. You can ALLOW or VIEW PROFILE.`;
        
        await Database.query(
            'INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)',
            [target_user_id, 'system', title, content]
        );
        
        res.json({ 
            success: true, 
            message: 'Intimacy access request sent',
            notification: 'User will receive an email notification'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;