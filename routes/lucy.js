const express = require('express');
const { Database } = require('../config/database');
const router = express.Router();

// Get Lucy AI status
router.get('/status', async (req, res) => {
    try {
        const lucy = await Database.getLucyCharacter();
        const analytics = await Database.getLucyAnalytics();
        res.json({ 
            success: true, 
            lucy, 
            analytics,
            active: !!lucy 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Social Networks endpoints
router.get('/social-networks', async (req, res) => {
    try {
        const networks = await Database.getAllSocialNetworks();
        res.json({ success: true, networks });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/social-networks/:id', async (req, res) => {
    try {
        const { connection_status, posting_enabled, auto_posting } = req.body;
        await Database.updateSocialNetworkStatus(
            req.params.id, 
            connection_status, 
            posting_enabled, 
            auto_posting
        );
        res.json({ success: true, message: 'Social network updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PR Firms endpoints
router.get('/pr-firms', async (req, res) => {
    try {
        const firms = await Database.getAllPRFirms();
        res.json({ success: true, firms });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/pr-firms/:id', async (req, res) => {
    try {
        const { relationship_status, last_contact_date } = req.body;
        await Database.updatePRFirmRelationship(
            req.params.id, 
            relationship_status, 
            last_contact_date
        );
        res.json({ success: true, message: 'PR firm updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Campaign Actions endpoints
router.get('/actions', async (req, res) => {
    try {
        const { status } = req.query;
        const actions = await Database.getCampaignActions(status);
        res.json({ success: true, actions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/actions', async (req, res) => {
    try {
        const result = await Database.createCampaignAction(req.body);
        res.json({ success: true, action_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/actions/:id', async (req, res) => {
    try {
        const { status, action_taken, receipt_received, receipt_url } = req.body;
        await Database.updateCampaignActionStatus(
            req.params.id, 
            status, 
            action_taken, 
            receipt_received, 
            receipt_url
        );
        res.json({ success: true, message: 'Campaign action updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Action Receipts endpoints
router.post('/receipts', async (req, res) => {
    try {
        const result = await Database.createActionReceipt(req.body);
        res.json({ success: true, receipt_id: result.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
    try {
        const analytics = await Database.getLucyAnalytics();
        res.json({ success: true, analytics });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create campaign
router.post('/campaign', async (req, res) => {
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

module.exports = router;