const express = require('express');
const router = express.Router();
const { Database } = require('../config/database');
const { ValidationError, AuthenticationError, DatabaseError } = require('../utils/errors');

// Get all creator roles
router.get('/creator-roles', async (req, res) => {
    try {
        const query = `
            SELECT 
                id,
                role_name,
                role_description,
                commission_rate,
                min_followers,
                max_posts_per_month,
                can_feature_listings,
                sort_order,
                is_active,
                lives,
                can_vote
            FROM creator_roles 
            WHERE is_active = TRUE 
            ORDER BY id ASC
        `;
        
        const roles = await Database.query(query);
        
        res.json({
            success: true,
            roles
        });
    } catch (error) {
        console.error('Error fetching creator roles:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch creator roles' 
        });
    }
});

// Get all creator profiles for admin
router.get('/creator-profiles', async (req, res) => {
    try {
        const query = `
            SELECT 
                ucp.*,
                cr.role_name,
                COUNT(ll.id) as listings_count
            FROM user_creator_profiles ucp
            LEFT JOIN creator_roles cr ON ucp.creator_role_id = cr.id
            LEFT JOIN lifestyle_listings ll ON ucp.id = ll.creator_id
            GROUP BY ucp.id
            ORDER BY ucp.created_at DESC
        `;
        
        const profiles = await Database.query(query);
        
        res.json({
            success: true,
            profiles
        });
    } catch (error) {
        console.error('Error fetching creator profiles:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch creator profiles' 
        });
    }
});

// Update creator profile status
router.put('/creator-profiles/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }
        
        const query = `
            UPDATE user_creator_profiles 
            SET approval_status = ?, updated_at = NOW()
            WHERE id = ?
        `;
        
        await Database.query(query, [status, id]);
        
        res.json({
            success: true,
            message: 'Creator status updated successfully'
        });
    } catch (error) {
        console.error('Error updating creator status:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update creator status' 
        });
    }
});

// Creator login
router.post('/creator-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        
        // First check if user exists
        const userQuery = 'SELECT id, email, password_hash FROM users WHERE email = ?';
        const users = await Database.query(userQuery, [email]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        
        // Check if user has creator profile
        const creatorQuery = `
            SELECT 
                ucp.*,
                cr.role_name
            FROM user_creator_profiles ucp
            LEFT JOIN creator_roles cr ON ucp.creator_role_id = cr.id
            WHERE ucp.user_id = ? AND ucp.is_active = TRUE
        `;
        
        const creators = await Database.query(creatorQuery, [users[0].id]);
        
        if (creators.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'No creator profile found for this account'
            });
        }
        
        const creator = creators[0];
        
        if (creator.approval_status !== 'approved') {
            return res.status(401).json({
                success: false,
                error: `Creator account is ${creator.approval_status}. Please wait for approval.`
            });
        }
        
        // TODO: Add proper password verification here
        // For now, we'll accept any password (implement bcrypt later)
        
        res.json({
            success: true,
            creator: {
                id: creator.id,
                creator_name: creator.creator_name,
                role_name: creator.role_name,
                approval_status: creator.approval_status
            }
        });
    } catch (error) {
        console.error('Error in creator login:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed' 
        });
    }
});

// Creator registration
router.post('/creator-register', async (req, res, next) => {
    try {
        const {
            email,
            password,
            creatorName,
            creatorTagline,
            bio,
            followerCount,
            location,
            contactEmail,
            instagramUrl,
            facebookUrl,
            linkedinUrl,
            tiktokUrl,
            xUrl
        } = req.body;
        
        if (!email || !password || !creatorName) {
            throw new ValidationError('Email, password, and creator name are required');
        }
        
        // Check if user already exists
        const existingUserQuery = 'SELECT id FROM users WHERE email = ?';
        const existingUsers = await Database.query(existingUserQuery, [email]);
        
        let userId;
        
        if (existingUsers.length > 0) {
            userId = existingUsers[0].id;
            
            // Check if already has creator profile
            const existingCreatorQuery = 'SELECT id FROM user_creator_profiles WHERE user_id = ?';
            const existingCreators = await Database.query(existingCreatorQuery, [userId]);
            
            if (existingCreators.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Creator profile already exists for this email'
                });
            }
        } else {
            // Create new user
            const walletId = 'wallet_' + Date.now();
            const userInsertQuery = `
                INSERT INTO users (email, password_hash, wallet_id, created_at)
                VALUES (?, ?, ?, NOW())
            `;
            
            const userResult = await Database.query(userInsertQuery, [email, password, walletId]);
            userId = userResult.insertId;
        }
        
        // Create creator profile (default to Ambassador role - ID 12)
        const creatorInsertQuery = `
            INSERT INTO user_creator_profiles (
                user_id,
                creator_role_id,
                creator_name,
                creator_tagline,
                bio,
                follower_count,
                location,
                contact_email,
                instagram_url,
                facebook_url,
                linkedin_url,
                tiktok_url,
                x_url,
                approval_status,
                is_active,
                created_at
            ) VALUES (?, 12, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', TRUE, NOW())
        `;
        
        await Database.query(creatorInsertQuery, [
            userId,
            creatorName,
            creatorTagline || '',
            bio || '',
            followerCount || 0,
            location || '',
            contactEmail || email,
            instagramUrl || null,
            facebookUrl || null,
            linkedinUrl || null,
            tiktokUrl || null,
            xUrl || null
        ]);
        
        res.json({
            success: true,
            message: 'Creator account created successfully. Please wait for approval.'
        });
    } catch (error) {
        next(error);
    }
});

// Creator dashboard data
router.get('/creator-dashboard/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw new ValidationError('Creator ID is required');
        }
        
        // Get creator profile
        const creatorQuery = `
            SELECT 
                ucp.*,
                cr.role_name
            FROM user_creator_profiles ucp
            LEFT JOIN creator_roles cr ON ucp.creator_role_id = cr.id
            WHERE ucp.id = ? AND ucp.is_active = TRUE
        `;
        
        const creators = await Database.query(creatorQuery, [id]);
        
        if (creators.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Creator not found'
            });
        }
        
        const creator = creators[0];
        
        // Get creator stats with fallback
        try {
            const statsQuery = `
                SELECT 
                    COUNT(ll.id) as total_listings,
                    COALESCE(SUM(ll.views_count), 0) as total_views,
                    COALESCE(SUM(ll.bucketlist_count), 0) as total_bucketlists,
                    COALESCE(SUM(ll.shares_count), 0) as total_shares,
                    COALESCE(SUM(ll.zaps_count), 0) as total_zaps,
                    0 as total_followers,
                    0 as total_sponsors
                FROM lifestyle_listings ll
                WHERE ll.creator_id = ?
            `;
            
            const stats = await Database.query(statsQuery, [id]);
            creator.stats = stats[0] || {
                total_listings: 0,
                total_views: 0,
                total_bucketlists: 0,
                total_shares: 0,
                total_zaps: 0,
                total_followers: 0,
                total_sponsors: 0
            };
        } catch (statsError) {
            console.warn('Stats query failed, using defaults:', statsError);
            creator.stats = {
                total_listings: 0,
                total_views: 0,
                total_bucketlists: 0,
                total_shares: 0,
                total_zaps: 0,
                total_followers: 0,
                total_sponsors: 0
            };
        }
        
        res.json({
            success: true,
            creator
        });
    } catch (error) {
        next(error);
    }
});

// Get creator listings
router.get('/creator-listings/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            throw new ValidationError('Creator ID is required');
        }
        
        // Simplified query without joins that might not exist
        const query = `
            SELECT 
                ll.*
            FROM lifestyle_listings ll
            WHERE ll.creator_id = ?
            ORDER BY ll.created_at DESC
        `;
        
        const listings = await Database.query(query, [id]);
        
        // Add door category names if available
        for (let listing of listings) {
            if (listing.door_category_id) {
                try {
                    const categoryQuery = 'SELECT name FROM door_categories WHERE id = ?';
                    const categories = await Database.query(categoryQuery, [listing.door_category_id]);
                    listing.door_category_name = categories[0]?.name || null;
                } catch (err) {
                    listing.door_category_name = null;
                }
            }
        }
        
        res.json({
            success: true,
            listings: listings || []
        });
    } catch (error) {
        console.error('Error in creator-listings API:', error);
        next(error);
    }
});

// Update existing listing
router.put('/creator-listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            tagline,
            description,
            city,
            state,
            price_range,
            door_category_id
        } = req.body;
        
        if (!id || !title) {
            return res.status(400).json({
                success: false,
                error: 'Listing ID and title are required'
            });
        }
        
        const query = `
            UPDATE lifestyle_listings SET
                title = ?,
                tagline = ?,
                description = ?,
                brief_description = ?,
                city = ?,
                state = ?,
                country = ?,
                price_range = ?,
                door_category_id = ?,
                featured_image = ?,
                image_gallery = ?,
                updated_at = NOW()
            WHERE id = ?
        `;
        
        await Database.query(query, [
            title,
            tagline || '',
            description || '',
            req.body.brief_description || '',
            city || '',
            state || '',
            req.body.country || 'USA',
            price_range || 'medium',
            door_category_id || null,
            req.body.featured_image || null,
            req.body.image_gallery || null,
            id
        ]);
        
        res.json({
            success: true,
            message: 'Listing updated successfully'
        });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update listing' 
        });
    }
});

// Create new listing
router.post('/creator-listings', async (req, res) => {
    try {
        const {
            creator_id,
            title,
            tagline,
            description,
            city,
            state,
            price_range,
            door_category_id
        } = req.body;
        
        if (!creator_id || !title) {
            return res.status(400).json({
                success: false,
                error: 'Creator ID and title are required'
            });
        }
        
        const query = `
            INSERT INTO lifestyle_listings (
                creator_id,
                title,
                tagline,
                description,
                brief_description,
                city,
                state,
                country,
                price_range,
                category_id,
                featured_image,
                image_gallery,
                status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())
        `;
        
        const result = await Database.query(query, [
            creator_id,
            title,
            tagline || '',
            description || '',
            req.body.brief_description || '',
            city || '',
            state || '',
            req.body.country || 'USA',
            price_range || 'medium',
            door_category_id || null,
            req.body.featured_image || null,
            req.body.image_gallery || null
        ]);
        
        res.json({
            success: true,
            listing_id: result.insertId,
            message: 'Listing created successfully'
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Failed to create listing' 
        });
    }
});

// Get creator followers
router.get('/creator-followers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                ucf.*,
                u.username,
                u.email
            FROM user_creator_followers ucf
            LEFT JOIN users u ON ucf.user_id = u.id
            WHERE ucf.creator_id = ?
            ORDER BY ucf.followed_at DESC
        `;
        
        const followers = await Database.query(query, [id]);
        
        res.json({
            success: true,
            followers
        });
    } catch (error) {
        console.error('Error fetching creator followers:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch creator followers' 
        });
    }
});

// Get door categories
router.get('/door-categories', async (req, res) => {
    try {
        // Check if door_categories table exists, if not return default categories
        let categories;
        try {
            const query = 'SELECT * FROM door_categories ORDER BY id';
            categories = await Database.query(query);
        } catch (tableError) {
            console.warn('door_categories table not found, using defaults');
            categories = [
                { id: 1, name: 'Blue Door (Values)' },
                { id: 2, name: 'Yellow Door (Compatibility)' },
                { id: 3, name: 'Red Door (Intimacy)' }
            ];
        }
        
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching door categories:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch door categories' 
        });
    }
});

// Get creator role by ID
router.get('/creator-roles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                id,
                role_name,
                role_description,
                commission_rate,
                min_followers,
                max_posts_per_month,
                can_feature_listings,
                sort_order,
                is_active,
                lives,
                can_vote
            FROM creator_roles 
            WHERE id = ? AND is_active = TRUE
        `;
        
        const roles = await Database.query(query, [id]);
        
        if (roles.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Creator role not found'
            });
        }
        
        res.json({
            success: true,
            role: roles[0]
        });
    } catch (error) {
        console.error('Error fetching creator role:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch creator role' 
        });
    }
});

// Follow/Unfollow creator
router.post('/follow-creator', async (req, res) => {
    try {
        const { userId, creatorId, isSponsor = false, sponsorLevel = 'bronze' } = req.body;
        
        if (!userId || !creatorId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Creator ID are required'
            });
        }
        
        // Check if already following
        const existingQuery = 'SELECT id FROM user_creator_followers WHERE user_id = ? AND creator_id = ?';
        const existing = await Database.query(existingQuery, [userId, creatorId]);
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Already following this creator'
            });
        }
        
        // Add follower
        const insertQuery = `
            INSERT INTO user_creator_followers (user_id, creator_id, is_sponsor, sponsor_level, followed_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        await Database.query(insertQuery, [userId, creatorId, isSponsor, sponsorLevel]);
        
        // Update user's following_creator_id if not sponsor (primary follow)
        if (!isSponsor) {
            const updateUserQuery = 'UPDATE users SET following_creator_id = ? WHERE id = ?';
            await Database.query(updateUserQuery, [creatorId, userId]);
        }
        
        res.json({
            success: true,
            message: 'Successfully following creator'
        });
    } catch (error) {
        console.error('Error following creator:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to follow creator' 
        });
    }
});

// Unfollow creator
router.delete('/follow-creator', async (req, res) => {
    try {
        const { userId, creatorId } = req.body;
        
        if (!userId || !creatorId) {
            return res.status(400).json({
                success: false,
                error: 'User ID and Creator ID are required'
            });
        }
        
        // Remove follower
        const deleteQuery = 'DELETE FROM user_creator_followers WHERE user_id = ? AND creator_id = ?';
        await Database.query(deleteQuery, [userId, creatorId]);
        
        // Update user's following_creator_id if this was their primary follow
        const updateUserQuery = 'UPDATE users SET following_creator_id = NULL WHERE id = ? AND following_creator_id = ?';
        await Database.query(updateUserQuery, [userId, creatorId]);
        
        res.json({
            success: true,
            message: 'Successfully unfollowed creator'
        });
    } catch (error) {
        console.error('Error unfollowing creator:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to unfollow creator' 
        });
    }
});

// Get available creators for following
router.get('/available-creators', async (req, res) => {
    try {
        const query = `
            SELECT 
                ucp.id,
                ucp.creator_name,
                ucp.creator_tagline,
                ucp.bio,
                ucp.profile_image,
                ucp.follower_count,
                cr.role_name,
                cr.commission_rate,
                COUNT(ucf.id) as current_followers
            FROM user_creator_profiles ucp
            LEFT JOIN creator_roles cr ON ucp.creator_role_id = cr.id
            LEFT JOIN user_creator_followers ucf ON ucp.id = ucf.creator_id
            WHERE ucp.approval_status = 'approved' AND ucp.is_active = TRUE
            GROUP BY ucp.id
            ORDER BY current_followers DESC, ucp.creator_name
        `;
        
        const creators = await Database.query(query);
        
        res.json({
            success: true,
            creators
        });
    } catch (error) {
        console.error('Error fetching available creators:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch available creators' 
        });
    }
});

module.exports = router;