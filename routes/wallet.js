const express = require('express');
const { Database } = require('../config/database');
const router = express.Router();

// Get wallet data for authenticated user
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        
        const user = await Database.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get avatars for this user's wallet
        const avatars = await Database.query(`
            SELECT id, name, tagline, image_url, door_choice, is_active, created_at
            FROM avatars 
            WHERE wallet_id = ?
            ORDER BY created_at DESC
        `, [user.wallet_id]);
        
        res.json({
            wallet_id: user.wallet_id,
            user_email: user.email,
            avatars: avatars
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;