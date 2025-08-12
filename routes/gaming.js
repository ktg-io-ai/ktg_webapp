const express = require('express');
const { Database } = require('../config/database');
const router = express.Router();

// Create Destiny session
router.post('/destiny/session', async (req, res) => {
    try {
        const { user_id, session_name, lives_used } = req.body;
        
        const sessionData = {
            user_id,
            session_name: session_name || 'Destiny Session',
            lives_used,
            doors_chosen: [],
            door_results: [],
            session_data: {}
        };
        
        const result = await Database.createDestinySession(sessionData);
        res.json({ success: true, session_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Destiny session with door choice
router.put('/destiny/session/:id/door', async (req, res) => {
    try {
        const { door_choice, door_result } = req.body;
        const sessionId = req.params.id;
        
        // Get current session
        const session = await Database.query(
            'SELECT doors_chosen, door_results FROM destiny_sessions WHERE id = ?',
            [sessionId]
        );
        
        if (!session[0]) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        const doors_chosen = JSON.parse(session[0].doors_chosen || '[]');
        const door_results = JSON.parse(session[0].door_results || '[]');
        
        doors_chosen.push(door_choice);
        door_results.push(door_result);
        
        await Database.query(
            'UPDATE destiny_sessions SET doors_chosen = ?, door_results = ? WHERE id = ?',
            [JSON.stringify(doors_chosen), JSON.stringify(door_results), sessionId]
        );
        
        res.json({ success: true, doors_chosen, door_results });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user stats
router.get('/stats/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        
        // Get basic stats
        const sessions = await Database.query(
            'SELECT COUNT(*) as total_sessions, SUM(tokens_won) as total_tokens FROM destiny_sessions WHERE user_id = ?',
            [userId]
        );
        
        const connections = await Database.query(
            'SELECT COUNT(*) as total_connections FROM user_connections WHERE (requester_id = ? OR addressee_id = ?) AND status = "accepted"',
            [userId, userId]
        );
        
        const bucketlist = await Database.query(
            'SELECT COUNT(*) as total_items FROM user_bucket_list WHERE user_id = ?',
            [userId]
        );
        
        const stats = {
            total_points: sessions[0]?.total_tokens || 0,
            level: Math.floor((sessions[0]?.total_sessions || 0) / 5) + 1,
            connections: connections[0]?.total_connections || 0,
            activities: sessions[0]?.total_sessions || 0,
            bucketlist_items: bucketlist[0]?.total_items || 0
        };
        
        res.json({ stats });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add to bucket list
router.post('/bucketlist', async (req, res) => {
    try {
        const { user_id, idea_id, priority } = req.body;
        
        await Database.query(
            'INSERT INTO user_bucket_list (user_id, idea_id, priority) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE priority = VALUES(priority)',
            [user_id, idea_id, priority || 'medium']
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user bucket list
router.get('/bucketlist/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        
        const bucketlist = await Database.query(`
            SELECT bl.*, i.title, i.description, i.image, i.location, i.category
            FROM user_bucket_list bl
            JOIN ideas i ON bl.idea_id = i.id
            WHERE bl.user_id = ?
            ORDER BY bl.added_at DESC
        `, [userId]);
        
        res.json({ bucketlist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update bucket list item status
router.put('/bucketlist/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const itemId = req.params.id;
        
        await Database.query(
            'UPDATE user_bucket_list SET status = ? WHERE id = ?',
            [status, itemId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Door #4 special action
router.post('/door4/enter', async (req, res) => {
    try {
        const { user_id, action } = req.body;
        
        // Create special door4 session
        const sessionData = {
            user_id,
            session_name: 'Door #4 Mystery',
            lives_used: 1,
            doors_chosen: ['door4'],
            door_results: [{ action, timestamp: new Date() }],
            session_data: { mystery_door: true, action }
        };
        
        const result = await Database.createDestinySession(sessionData);
        
        // Award mystery tokens
        await Database.query(
            'INSERT INTO user_tokens (user_id, token_type, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
            [user_id, 'diamond', 1]
        );
        
        res.json({ 
            success: true, 
            session_id: result.insertId,
            reward: 'diamond_token',
            message: 'You discovered something mysterious behind Door #4!'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Zap action (gaming interaction)
router.post('/zap', async (req, res) => {
    try {
        const { user_id, target_user_id, zap_type } = req.body;
        
        // Record zap action
        await Database.query(
            'INSERT INTO destiny_sessions (user_id, session_name, lives_used, doors_chosen, door_results, session_data) VALUES (?, ?, ?, ?, ?, ?)',
            [
                user_id,
                'Zap Action',
                0,
                JSON.stringify(['zap']),
                JSON.stringify([{ target: target_user_id, type: zap_type }]),
                JSON.stringify({ action: 'zap', target: target_user_id, type: zap_type })
            ]
        );
        
        res.json({ success: true, message: 'Zap sent!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;