// KTG Local Development Server
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Database } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'KTG Local Server Running' });
});

// Import route modules
const userRoutes = require('./routes/users');
const gamingRoutes = require('./routes/gaming');
const notificationRoutes = require('./routes/notifications');
const lucyRoutes = require('./routes/lucy');
const walletRoutes = require('./routes/wallet');

app.use('/api/users', userRoutes);
app.use('/api/gaming', gamingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lucy', lucyRoutes);
app.use('/api/wallet', walletRoutes);

// Lucy AI routes
app.get('/api/lucy/status', async (req, res) => {
    try {
        const lucy = await Database.getLucyCharacter();
        res.json({ lucy, active: !!lucy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/lucy/campaign', async (req, res) => {
    try {
        const lucy = await Database.getLucyCharacter();
        if (!lucy) {
            return res.status(404).json({ error: 'Lucy AI not found' });
        }
        
        const campaignData = {
            lucy_id: lucy.id,
            ...req.body
        };
        
        const result = await Database.createCampaign(campaignData);
        res.json({ success: true, campaign_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Gaming routes
app.post('/api/destiny/session', async (req, res) => {
    try {
        const result = await Database.createDestinySession(req.body);
        res.json({ success: true, session_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Serve main app - only for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`KTG Local Development Server running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});

module.exports = app;