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
        
        // Create wallet for new user
        await Database.createWallet(result.insertId, wallet_id);
        
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

// Get all users for admin dashboard
router.get('/', async (req, res) => {
    try {
        const users = await Database.query(`
            SELECT 
                u.id, 
                u.email, 
                u.username, 
                u.first_name, 
                u.last_name, 
                u.wallet_id, 
                u.user_image, 
                u.account_title, 
                u.created_at,
                COUNT(a.id) as avatar_count,
                CASE WHEN u.email = 'gamemaster@ktg.io' THEN 1 ELSE 0 END as is_creator,
                0 as chess_active,
                0 as bling_active,
                1 as level,
                NULL as creator_date,
                NULL as last_level_up
            FROM users u
            LEFT JOIN avatars a ON u.wallet_id = a.wallet_id
            GROUP BY u.id, u.email, u.username, u.first_name, u.last_name, u.wallet_id, u.user_image, u.account_title, u.created_at
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, users });
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
        const avatars = await Database.query(`
            SELECT 
                a.id,
                a.name,
                a.image_url,
                a.tagline,
                a.door_choice,
                a.is_active,
                a.created_at
            FROM avatars a
            WHERE a.is_active = TRUE
            ORDER BY a.created_at DESC
        `);
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
        const { avatarId, questionKey, answer, locationId } = req.body;
        
        if (!avatarId || !questionKey || !answer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        console.log('Saving answer:', { avatarId, questionKey, answer });
        
        // Use the Database helper function
        await Database.saveJourneyBookAnswer(avatarId, questionKey, answer);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving journeybook answer:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get journeybook answers for avatar
router.get('/journeybook/:avatarId', async (req, res) => {
    try {
        console.log('Loading answers for avatar:', req.params.avatarId);
        
        // Use the Database helper function
        const answers = await Database.getJourneyBookAnswers(req.params.avatarId);
        
        console.log(`Loaded ${Object.keys(answers).length} answers for avatar ${req.params.avatarId}`);
        res.json(answers);
    } catch (error) {
        console.error('Error loading avatar answers:', error);
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

// Save journeybook page template
router.post('/journeybook/page', async (req, res) => {
    try {
        const { section, subgroup, question, options, imageUrl, pageNumber } = req.body;
        
        if (!section || !subgroup || !question || !pageNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        await Database.saveJourneyBookPage(section, subgroup, question, options, imageUrl, pageNumber);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update journeybook page
router.put('/journeybook/page/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl, imageLink } = req.body;
        
        await Database.query(
            'UPDATE journeybook_pages SET image_url = ?, image_link = ? WHERE id = ?',
            [imageUrl, imageLink, id]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Save journeybook image
router.post('/journeybook/image', async (req, res) => {
    try {
        const { avatarId, pageNumber, imageUrl, prompt } = req.body;
        
        if (!avatarId || !pageNumber || !imageUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        await Database.saveJourneyBookImage(avatarId, pageNumber, imageUrl, prompt);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get journeybook images for avatar
router.get('/journeybook/images/:avatarId', async (req, res) => {
    try {
        const images = await Database.getJourneyBookImages(req.params.avatarId);
        res.json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get specific journeybook image
router.get('/journeybook/image/:avatarId/:pageNumber', async (req, res) => {
    try {
        const image = await Database.getJourneyBookImage(req.params.avatarId, req.params.pageNumber);
        res.json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get journeybook page image
router.get('/journeybook/page/:pageNumber', async (req, res) => {
    try {
        const page = await Database.getJourneyBookPageImage(req.params.pageNumber);
        res.json(page);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all journeybook pages (raw array for testing)
router.get('/journeybook/pages', async (req, res) => {
    try {
        const pages = await Database.getAllJourneyBookPages();
        res.json(pages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user wallet with avatars and tokens
router.get('/wallet/:walletId', async (req, res) => {
    const mysql = require('mysql2/promise');
    let connection;
    
    try {
        const { walletId } = req.params;
        console.log('Loading wallet for:', walletId);
        
        // Use direct MySQL connection for ktg_local_dev
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        // Get user info
        const [users] = await connection.execute(
            'SELECT id, email, username, first_name, last_name, wallet_id FROM users WHERE wallet_id = ?',
            [walletId]
        );
        
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get active avatars
        const [avatars] = await connection.execute(
            'SELECT id, name, gender, tagline, image_url, generation_count, is_active, created_at FROM avatars WHERE wallet_id = ? AND is_active = TRUE',
            [walletId]
        );
        
        // Get wallet tokens from wallet_tokens table
        const [tokens] = await connection.execute(`
            SELECT 
                wt.token_type,
                wt.quantity
            FROM wallets w
            JOIN wallet_tokens wt ON w.id = wt.wallet_id
            WHERE w.wallet_id = ?
        `, [walletId]);
        
        console.log('Found tokens:', tokens);
        
        // Format tokens as object
        const tokenBalance = {
            life_1: 0,
            life_3: 0,
            life_6: 0,
            life_9: 0,
            diamond: 0
        };
        
        tokens.forEach(token => {
            if (tokenBalance.hasOwnProperty(token.token_type)) {
                tokenBalance[token.token_type] += token.quantity;
            }
        });
        
        res.json({
            success: true,
            user: users[0],
            avatars,
            tokens: tokenBalance
        });
    } catch (error) {
        console.error('Wallet error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Get structured journeybook pages
router.get('/journeybook/pages/structured', async (req, res) => {
    try {
        const pages = await Database.getAllJourneyBookPages();
        console.log('Raw pages from database:', pages.length);
        
        // Structure data by section and subgroup
        const structuredData = {};
        
        pages.forEach(page => {
            const section = page.section;
            const subgroup = page.subgroup;
            
            if (!structuredData[section]) {
                structuredData[section] = {};
            }
            
            if (!structuredData[section][subgroup]) {
                structuredData[section][subgroup] = [];
            }
            
            // Parse options if they're stored as JSON string
            let options = [];
            if (page.options) {
                try {
                    options = JSON.parse(page.options);
                } catch (e) {
                    options = [];
                }
            }
            
            structuredData[section][subgroup].push({
                id: page.id,
                question: page.question,
                options: options,
                image_url: page.image_url,
                image_link: page.image_link,
                section: section,
                subgroup: subgroup
            });
        });
        
        console.log('Structured data sections:', Object.keys(structuredData));
        console.log('Total structured sections:', Object.keys(structuredData).length);
        
        // Debug: Check if structuredData is empty
        if (Object.keys(structuredData).length === 0) {
            console.error('ERROR: structuredData is empty!');
            console.log('Raw pages sample:', pages.slice(0, 2));
        }
        
        res.json(structuredData);
    } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ 
            error: error.message, 
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
    }
});

// Update avatar location
router.put('/avatar/:avatarId/location', async (req, res) => {
    try {
        const { avatarId } = req.params;
        const { locationId } = req.body;
        
        if (!avatarId || !locationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Update avatar's location preference
        await Database.query(
            'UPDATE avatars SET location_preference = ? WHERE id = ?',
            [locationId, avatarId]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get avatars by location and door category for listings
router.get('/avatars/by-location/:locationId', async (req, res) => {
    try {
        const { locationId } = req.params;
        const { doorCategory } = req.query;
        
        let query = `
            SELECT 
                a.id,
                a.name,
                a.image_url,
                a.tagline,
                a.door_choice,
                a.created_at,
                u.email,
                l.city,
                l.country
            FROM avatars a
            JOIN users u ON a.wallet_id = u.wallet_id
            LEFT JOIN avatar_answers aa ON a.id = aa.avatar_id
            LEFT JOIN locations l ON aa.location_id = l.id
            WHERE a.is_active = TRUE
        `;
        
        const params = [];
        
        if (locationId && locationId !== 'all') {
            query += ' AND aa.location_id = ?';
            params.push(locationId);
        }
        
        if (doorCategory && doorCategory !== 'all') {
            query += ' AND a.door_choice = ?';
            params.push(doorCategory);
        }
        
        query += ' GROUP BY a.id ORDER BY a.created_at DESC';
        
        const avatars = await Database.query(query, params);
        res.json(avatars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;