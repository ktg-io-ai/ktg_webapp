const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all locations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT id, city, state, country, country_code, continent, 
                   is_major_city, population,
                   CONCAT(city, 
                          CASE WHEN state IS NOT NULL THEN CONCAT(', ', state) ELSE '' END,
                          ', ', country) as full_name
            FROM locations 
            WHERE is_active = TRUE 
            ORDER BY 
                CASE WHEN is_major_city THEN 0 ELSE 1 END,
                population DESC,
                city ASC
        `;
        
        const locations = await db.query(query);
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// Search locations
router.get('/search', async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.json([]);
        }
        
        const searchTerm = q.trim();
        const query = `
            SELECT id, city, state, country, country_code,
                   CONCAT(city, 
                          CASE WHEN state IS NOT NULL THEN CONCAT(', ', state) ELSE '' END,
                          ', ', country) as full_name
            FROM locations
            WHERE (city LIKE ? OR country LIKE ? OR (state IS NOT NULL AND state LIKE ?))
            AND is_active = TRUE
            ORDER BY 
                CASE WHEN is_major_city THEN 0 ELSE 1 END,
                population DESC,
                city ASC
            LIMIT ?
        `;
        
        const searchPattern = `%${searchTerm}%`;
        const locations = await db.query(query, [searchPattern, searchPattern, searchPattern, parseInt(limit)]);
        
        res.json(locations);
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ error: 'Failed to search locations' });
    }
});

// Get location by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT * FROM locations 
            WHERE id = ? AND is_active = TRUE
        `;
        
        const locations = await db.query(query, [id]);
        
        if (locations.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        
        res.json(locations[0]);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

// Get door categories
router.get('/door-categories', async (req, res) => {
    try {
        const query = `
            SELECT * FROM door_categories 
            WHERE is_active = TRUE 
            ORDER BY sort_order ASC
        `;
        
        const categories = await db.query(query);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching door categories:', error);
        res.status(500).json({ error: 'Failed to fetch door categories' });
    }
});

// Get major cities by continent
router.get('/continent/:continent', async (req, res) => {
    try {
        const { continent } = req.params;
        
        const query = `
            SELECT id, city, state, country, country_code, population,
                   CONCAT(city, 
                          CASE WHEN state IS NOT NULL THEN CONCAT(', ', state) ELSE '' END,
                          ', ', country) as full_name
            FROM locations 
            WHERE continent = ? AND is_major_city = TRUE AND is_active = TRUE
            ORDER BY population DESC, city ASC
        `;
        
        const locations = await db.query(query, [continent]);
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations by continent:', error);
        res.status(500).json({ error: 'Failed to fetch locations by continent' });
    }
});

// Get countries
router.get('/countries/list', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT country, country_code, continent,
                   COUNT(*) as city_count
            FROM locations 
            WHERE is_active = TRUE
            GROUP BY country, country_code, continent
            ORDER BY country ASC
        `;
        
        const countries = await db.query(query);
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

module.exports = router;