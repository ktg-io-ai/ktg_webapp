const express = require('express');
const router = express.Router();
const { Database } = require('../config/database');
const mysql = require('mysql2/promise');

// Database connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ktg_local_dev'
};

// Distribute tokens to specific user
router.post('/distribute', async (req, res) => {
    const { email, tokens } = req.body;
    
    if (!email || !tokens) {
        return res.status(400).json({ success: false, message: 'Email and tokens required' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Find user by email
        const [users] = await connection.execute(
            'SELECT id, wallet_id FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const user = users[0];
        
        // Get or create wallet
        let [wallets] = await connection.execute(
            'SELECT id FROM wallets WHERE wallet_id = ?',
            [user.wallet_id]
        );
        
        let walletDbId;
        if (wallets.length === 0) {
            // Create wallet
            const [result] = await connection.execute(
                'INSERT INTO wallets (user_id, wallet_id, created_at) VALUES (?, ?, NOW())',
                [user.id, user.wallet_id]
            );
            walletDbId = result.insertId;
        } else {
            walletDbId = wallets[0].id;
        }
        
        // Add tokens to wallet_tokens table
        const tokenTypes = ['life_1', 'life_3', 'life_6', 'life_9', 'diamond'];
        
        for (const tokenType of tokenTypes) {
            if (tokens[tokenType] && tokens[tokenType] > 0) {
                // Check if token type exists for this wallet
                const [existing] = await connection.execute(
                    'SELECT id, quantity FROM wallet_tokens WHERE wallet_id = ? AND token_type = ?',
                    [walletDbId, tokenType]
                );
                
                if (existing.length > 0) {
                    // Update existing
                    await connection.execute(
                        'UPDATE wallet_tokens SET quantity = quantity + ?, updated_at = NOW() WHERE id = ?',
                        [tokens[tokenType], existing[0].id]
                    );
                } else {
                    // Insert new
                    await connection.execute(
                        'INSERT INTO wallet_tokens (wallet_id, token_type, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                        [walletDbId, tokenType, tokens[tokenType]]
                    );
                }
            }
        }
        
        await connection.end();
        res.json({ success: true, message: `Tokens distributed to ${email}` });
        
    } catch (error) {
        console.error('Error distributing tokens:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Distribute tokens to all users
router.post('/distribute-all', async (req, res) => {
    const { tokens } = req.body;
    
    if (!tokens) {
        return res.status(400).json({ success: false, message: 'Tokens required' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Get all users
        const [users] = await connection.execute('SELECT id, email, wallet_id FROM users');
        
        let distributed = 0;
        
        for (const user of users) {
            try {
                // Get or create wallet
                let [wallets] = await connection.execute(
                    'SELECT id FROM wallets WHERE wallet_id = ?',
                    [user.wallet_id]
                );
                
                let walletDbId;
                if (wallets.length === 0) {
                    // Create wallet
                    const [result] = await connection.execute(
                        'INSERT INTO wallets (user_id, wallet_id, created_at) VALUES (?, ?, NOW())',
                        [user.id, user.wallet_id]
                    );
                    walletDbId = result.insertId;
                } else {
                    walletDbId = wallets[0].id;
                }
                
                // Add tokens
                const tokenTypes = ['life_1', 'life_3', 'life_6', 'life_9', 'diamond'];
                
                for (const tokenType of tokenTypes) {
                    if (tokens[tokenType] && tokens[tokenType] > 0) {
                        const [existing] = await connection.execute(
                            'SELECT id, quantity FROM wallet_tokens WHERE wallet_id = ? AND token_type = ?',
                            [walletDbId, tokenType]
                        );
                        
                        if (existing.length > 0) {
                            await connection.execute(
                                'UPDATE wallet_tokens SET quantity = quantity + ?, updated_at = NOW() WHERE id = ?',
                                [tokens[tokenType], existing[0].id]
                            );
                        } else {
                            await connection.execute(
                                'INSERT INTO wallet_tokens (wallet_id, token_type, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                                [walletDbId, tokenType, tokens[tokenType]]
                            );
                        }
                    }
                }
                
                distributed++;
            } catch (error) {
                console.error(`Error distributing to ${user.email}:`, error);
            }
        }
        
        await connection.end();
        res.json({ success: true, message: `Tokens distributed to ${distributed} users` });
        
    } catch (error) {
        console.error('Error in bulk distribution:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// View all wallets
router.get('/wallets', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const [wallets] = await connection.execute(`
            SELECT 
                u.email,
                w.wallet_id,
                w.created_at,
                COALESCE(SUM(CASE WHEN wt.token_type = 'life_1' THEN wt.quantity END), 0) as life_1,
                COALESCE(SUM(CASE WHEN wt.token_type = 'life_3' THEN wt.quantity END), 0) as life_3,
                COALESCE(SUM(CASE WHEN wt.token_type = 'life_6' THEN wt.quantity END), 0) as life_6,
                COALESCE(SUM(CASE WHEN wt.token_type = 'life_9' THEN wt.quantity END), 0) as life_9,
                COALESCE(SUM(CASE WHEN wt.token_type = 'diamond' THEN wt.quantity END), 0) as diamond
            FROM wallets w
            JOIN users u ON w.user_id = u.id
            LEFT JOIN wallet_tokens wt ON w.id = wt.wallet_id
            GROUP BY w.id, u.email, w.wallet_id, w.created_at
            ORDER BY w.created_at DESC
        `);
        
        await connection.end();
        res.json({ success: true, wallets });
        
    } catch (error) {
        console.error('Error loading wallets:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Reset all wallets
router.post('/reset-all', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Delete all wallet tokens
        const [result] = await connection.execute('DELETE FROM wallet_tokens');
        
        await connection.end();
        res.json({ success: true, message: `Reset ${result.affectedRows} wallet tokens` });
        
    } catch (error) {
        console.error('Error resetting wallets:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

module.exports = router;