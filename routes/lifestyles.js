const express = require('express');
const router = express.Router();
const { Database } = require('../config/database');

// Get all lifestyle listings with filtering
router.get('/listings', async (req, res) => {
    try {
        const { 
            location, 
            doorCategory, 
            limit = 50, 
            offset = 0,
            sortBy = 'newest',
            priceRange,
            category
        } = req.query;
        
        // Simplified query without complex joins
        let query = `
            SELECT 
                ll.*,
                ucp.creator_name,
                ucp.profile_image as creator_image,
                ucp.creator_tagline
            FROM lifestyle_listings ll
            LEFT JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
            WHERE ll.status = 'published'
        `;
        
        const params = [];
        
        // Filter by door category
        if (doorCategory && doorCategory !== 'all') {
            if (doorCategory === 'blue') {
                query += ' AND ll.door_category_id = 1';
            } else if (doorCategory === 'yellow') {
                query += ' AND ll.door_category_id = 2';
            } else if (doorCategory === 'red') {
                query += ' AND ll.door_category_id = 3';
            }
        }
        
        // Filter by price range
        if (priceRange && priceRange !== 'all') {
            query += ' AND ll.price_range = ?';
            params.push(priceRange);
        }
        
        // Sorting
        switch (sortBy) {
            case 'newest':
                query += ' ORDER BY ll.created_at DESC';
                break;
            case 'oldest':
                query += ' ORDER BY ll.created_at ASC';
                break;
            case 'popular':
                query += ' ORDER BY ll.views_count DESC';
                break;
            default:
                query += ' ORDER BY ll.created_at DESC';
        }
        
        // Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const listings = await Database.query(query, params);
        
        // Add door category info
        const doorMap = { 1: 'blue', 2: 'yellow', 3: 'red' };
        listings.forEach(listing => {
            listing.door_category = doorMap[listing.door_category_id] || 'unknown';
            listing.promoter_name = listing.creator_name;
            listing.promoter_tagline = listing.creator_tagline;
            listing.promoter_image_link = listing.creator_image;
        });
        
        const total = listings.length;
        
        res.json({
            success: true,
            listings
        });
    } catch (error) {
        console.error('Error fetching lifestyle listings:', error);
        res.status(500).json({ error: 'Failed to fetch lifestyle listings' });
    }
});

// Get listings by door category (for filtering by user's door choice)
router.get('/listings/door/:doorColor', async (req, res) => {
    try {
        const { doorColor } = req.params;
        const { location, limit = 20 } = req.query;
        
        // Map door colors to database values
        const doorMap = {
            'blue': 'Blue',
            'yellow': 'Yellow', 
            'red': 'Red'
        };
        
        const doorCategory = doorMap[doorColor.toLowerCase()];
        if (!doorCategory) {
            return res.status(400).json({ error: 'Invalid door color' });
        }
        
        let query = `
            SELECT 
                ll.*,
                l.city,
                l.country,
                dc.name as door_category,
                dc.color as door_color,
                ucp.creator_name,
                ucp.profile_image as creator_image
            FROM lifestyle_listings ll
            JOIN door_categories dc ON ll.door_category_id = dc.id
            LEFT JOIN locations l ON ll.location_id = l.id
            LEFT JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
            WHERE ll.status = 'published' AND dc.name = ?
        `;
        
        const params = [doorCategory];
        
        if (location && location !== 'all') {
            query += ' AND ll.location_id = ?';
            params.push(location);
        }
        
        query += ' ORDER BY ll.created_at DESC LIMIT ?';
        params.push(parseInt(limit));
        
        const listings = await db.query(query, params);
        
        res.json({
            success: true,
            listings,
            doorCategory: doorCategory,
            doorColor: doorColor
        });
    } catch (error) {
        console.error('Error fetching listings by door:', error);
        res.status(500).json({ error: 'Failed to fetch listings by door category' });
    }
});

// Get single listing by ID
router.get('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                ll.*,
                l.city,
                l.state,
                l.country,
                l.country_code,
                dc.name as door_category,
                dc.color as door_color,
                ucp.creator_name,
                ucp.profile_image as creator_image,
                ucp.creator_tagline,
                ucp.bio as creator_bio,
                ucp.social_links,
                lc.name as category_name,
                lc.color as category_color
            FROM lifestyle_listings ll
            LEFT JOIN locations l ON ll.location_id = l.id
            LEFT JOIN door_categories dc ON ll.door_category_id = dc.id
            LEFT JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
            LEFT JOIN listing_categories lc ON ll.category_id = lc.id
            WHERE ll.id = ? AND ll.status = 'published'
        `;
        
        const listings = await db.query(query, [id]);
        
        if (listings.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        
        // Increment view count
        await db.query('UPDATE lifestyle_listings SET views_count = views_count + 1 WHERE id = ?', [id]);
        
        res.json({
            success: true,
            listing: listings[0]
        });
    } catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

// Create new listing (for creators)
router.post('/listings', async (req, res) => {
    try {
        const {
            creatorId,
            title,
            description,
            briefDescription,
            categoryId,
            locationId,
            doorCategoryId,
            priceRange,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            startTime,
            endTime,
            maxParticipants,
            contactMethod,
            contactDetails,
            featuredImage,
            tags
        } = req.body;
        
        if (!creatorId || !title || !description || !locationId || !doorCategoryId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const query = `
            INSERT INTO lifestyle_listings (
                creator_id, title, description, brief_description, category_id,
                location_id, door_category_id, price_range, min_price, max_price,
                start_date, end_date, start_time, end_time, max_participants,
                contact_method, contact_details, featured_image, tags,
                status, created_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(), NOW())
        `;
        
        const result = await db.query(query, [
            creatorId, title, description, briefDescription, categoryId,
            locationId, doorCategoryId, priceRange, minPrice, maxPrice,
            startDate, endDate, startTime, endTime, maxParticipants,
            contactMethod, contactDetails, featuredImage, JSON.stringify(tags)
        ]);
        
        res.json({
            success: true,
            listingId: result.insertId,
            message: 'Listing created successfully'
        });
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// Update listing
router.put('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Build dynamic update query
        const allowedFields = [
            'title', 'description', 'brief_description', 'category_id',
            'location_id', 'door_category_id', 'price_range', 'min_price', 'max_price',
            'start_date', 'end_date', 'start_time', 'end_time', 'max_participants',
            'contact_method', 'contact_details', 'featured_image', 'tags', 'status'
        ];
        
        const updateFields = [];
        const params = [];
        
        Object.keys(updates).forEach(field => {
            if (allowedFields.includes(field)) {
                updateFields.push(`${field} = ?`);
                params.push(updates[field]);
            }
        });
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }
        
        params.push(id);
        
        const query = `UPDATE lifestyle_listings SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        
        await db.query(query, params);
        
        res.json({
            success: true,
            message: 'Listing updated successfully'
        });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
});

// Delete listing
router.delete('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query('UPDATE lifestyle_listings SET status = "archived" WHERE id = ?', [id]);
        
        res.json({
            success: true,
            message: 'Listing archived successfully'
        });
    } catch (error) {
        console.error('Error archiving listing:', error);
        res.status(500).json({ error: 'Failed to archive listing' });
    }
});

// Get listings by creator
router.get('/creator/:creatorId/listings', async (req, res) => {
    try {
        const { creatorId } = req.params;
        const { status = 'published', limit = 20 } = req.query;
        
        const query = `
            SELECT 
                ll.*,
                l.city,
                l.country,
                dc.name as door_category,
                dc.color as door_color
            FROM lifestyle_listings ll
            LEFT JOIN locations l ON ll.location_id = l.id
            LEFT JOIN door_categories dc ON ll.door_category_id = dc.id
            WHERE ll.creator_id = ? AND ll.status = ?
            ORDER BY ll.created_at DESC
            LIMIT ?
        `;
        
        const listings = await db.query(query, [creatorId, status, parseInt(limit)]);
        
        res.json({
            success: true,
            listings
        });
    } catch (error) {
        console.error('Error fetching creator listings:', error);
        res.status(500).json({ error: 'Failed to fetch creator listings' });
    }
});

// Get listing categories
router.get('/categories', async (req, res) => {
    try {
        const query = `
            SELECT * FROM listing_categories 
            WHERE is_active = TRUE 
            ORDER BY sort_order ASC, name ASC
        `;
        
        const categories = await db.query(query);
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Search listings
router.get('/search', async (req, res) => {
    try {
        const { q, location, doorCategory, limit = 20 } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.json({ success: true, listings: [] });
        }
        
        const searchTerm = `%${q.trim()}%`;
        
        let query = `
            SELECT 
                ll.*,
                l.city,
                l.country,
                dc.name as door_category,
                dc.color as door_color,
                ucp.creator_name
            FROM lifestyle_listings ll
            LEFT JOIN locations l ON ll.location_id = l.id
            LEFT JOIN door_categories dc ON ll.door_category_id = dc.id
            LEFT JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
            WHERE ll.status = 'published' 
            AND (ll.title LIKE ? OR ll.description LIKE ? OR ll.tags LIKE ?)
        `;
        
        const params = [searchTerm, searchTerm, searchTerm];
        
        if (location && location !== 'all') {
            query += ' AND ll.location_id = ?';
            params.push(location);
        }
        
        if (doorCategory && doorCategory !== 'all') {
            query += ' AND ll.door_category_id = ?';
            params.push(doorCategory);
        }
        
        query += ' ORDER BY ll.created_at DESC LIMIT ?';
        params.push(parseInt(limit));
        
        const listings = await db.query(query, params);
        
        res.json({
            success: true,
            listings,
            searchTerm: q
        });
    } catch (error) {
        console.error('Error searching listings:', error);
        res.status(500).json({ error: 'Failed to search listings' });
    }
});

module.exports = router;