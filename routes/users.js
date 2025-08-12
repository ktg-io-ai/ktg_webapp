const express = require('express');
const bcrypt = require('bcryptjs');
const { Database } = require('../config/database');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, first_name, last_name } = req.body;
        
        // Check if user exists
        const existingUser = await Database.getUserByEmail(email);
        if (existingUser) {
            return res.json({ 
                success: true, 
                existing_user: true,
                user_id: existingUser.id,
                message: 'User already exists, proceed to create new avatar'
            });
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Generate wallet ID
        const wallet_id = 'wallet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const userData = {
            email,
            password_hash,
            wallet_id,
            username,
            first_name,
            last_name
        };
        
        const result = await Database.createUser(userData);
        
        // Give new user starter tokens
        await Database.query(
            'INSERT INTO user_tokens (user_id, token_type, quantity) VALUES (?, ?, ?)',
            [result.insertId, '3life', 3]
        );
        
        res.json({ 
            success: true, 
            user_id: result.insertId,
            message: 'User created with 3 starter tokens'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Database.getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Note: last_login column not available in current schema
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                username: user.username,
                first_name: user.first_name,
                wallet_id: user.wallet_id
            } 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users for game console
router.get('/all', async (req, res) => {
    try {
        const users = await Database.query('SELECT id, email, username, first_name, last_name, wallet_id, user_image, account_title, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user profile (account level)
router.put('/profile', async (req, res) => {
    try {
        const { email, profileData } = req.body;
        
        const user = await Database.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await Database.updateUserProfile(user.id, profileData);
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create avatar
router.post('/avatar', async (req, res) => {
    try {
        const { email, avatarData } = req.body;
        
        const user = await Database.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get or create wallet
        let wallet = await Database.getWalletByUserId(user.id);
        if (!wallet) {
            await Database.createWallet(user.id, user.wallet_id);
            wallet = { wallet_id: user.wallet_id };
        }
        
        // Create avatar with proper field mapping
        const result = await Database.createAvatar({
            walletId: wallet.wallet_id,
            name: avatarData.name,
            gender: avatarData.gender,
            tagline: avatarData.tagline,
            imageUrl: avatarData.imageUrl,
            generationCount: avatarData.generationCount || 1
        });
        
        res.json({ success: true, avatar_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all avatars for game console
router.get('/avatars', async (req, res) => {
    try {
        const avatars = await Database.getAllActiveAvatars();
        res.json(avatars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await Database.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const tokens = await Database.getUserTokens(user.id);
        
        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                wallet_id: user.wallet_id,
                created_at: user.created_at
            },
            tokens
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Save journeybook answer
router.post('/journeybook/answer', async (req, res) => {
    try {
        const { avatarId, questionKey, answer } = req.body;
        
        if (!avatarId || !questionKey || !answer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        await Database.saveJourneyBookAnswer(avatarId, questionKey, answer);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get journeybook answers for avatar
router.get('/journeybook/:avatarId', async (req, res) => {
    try {
        const answers = await Database.getJourneyBookAnswers(req.params.avatarId);
        res.json(answers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get public journeybooks
router.get('/journeybooks/public', async (req, res) => {
    try {
        const journeybooks = await Database.getPublicJourneyBooks();
        res.json(journeybooks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get specific avatar's journeybook
router.get('/journeybook/avatar/:avatarId', async (req, res) => {
    try {
        const journeybook = await Database.getAvatarJourneyBook(req.params.avatarId);
        res.json(journeybook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;