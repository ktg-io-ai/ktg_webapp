const express = require('express');
const router = express.Router();
const { Database } = require('../config/database');

// Submit contractor form
router.post('/contractor-forms', async (req, res) => {
    try {
        const { agreementType, formData } = req.body;
        const creatorProfileId = req.session?.creatorProfileId || 1; // TODO: Get from session
        
        if (!agreementType || !formData) {
            return res.status(400).json({
                success: false,
                error: 'Agreement type and form data are required'
            });
        }

        const query = `
            INSERT INTO contractor_agreements (
                creator_profile_id,
                agreement_type,
                form_data,
                signature_data,
                ip_address,
                user_agent,
                signed_at,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'completed')
            ON DUPLICATE KEY UPDATE
                form_data = VALUES(form_data),
                signature_data = VALUES(signature_data),
                signed_at = VALUES(signed_at),
                status = VALUES(status),
                updated_at = NOW()
        `;

        const signatureData = formData.signature ? {
            signature: formData.signature,
            timestamp: new Date().toISOString()
        } : null;

        await Database.query(query, [
            creatorProfileId,
            agreementType,
            JSON.stringify(formData),
            JSON.stringify(signatureData),
            req.ip,
            req.get('User-Agent')
        ]);

        // Update compliance tracking
        await updateComplianceStatus(creatorProfileId, agreementType);

        res.json({
            success: true,
            message: 'Form submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting contractor form:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit form'
        });
    }
});

// Get contractor form status
router.get('/contractor-status', async (req, res) => {
    try {
        const creatorProfileId = req.session?.creatorProfileId || 1; // TODO: Get from session

        const query = `
            SELECT agreement_type, status, signed_at, created_at
            FROM contractor_agreements
            WHERE creator_profile_id = ?
        `;

        const forms = await Database.query(query, [creatorProfileId]);

        const complianceQuery = `
            SELECT * FROM contractor_compliance
            WHERE creator_profile_id = ?
        `;

        const compliance = await Database.query(complianceQuery, [creatorProfileId]);

        res.json({
            success: true,
            forms,
            compliance: compliance[0] || null
        });
    } catch (error) {
        console.error('Error fetching contractor status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch status'
        });
    }
});

// Finalize contractor onboarding
router.post('/contractor-finalize', async (req, res) => {
    try {
        const creatorProfileId = req.session?.creatorProfileId || 1; // TODO: Get from session

        // Check if all required forms are completed
        const requiredForms = ['independent_contractor', 'w9', 'direct_deposit', 'nda'];
        const completedQuery = `
            SELECT agreement_type
            FROM contractor_agreements
            WHERE creator_profile_id = ? AND status = 'completed'
        `;

        const completed = await Database.query(completedQuery, [creatorProfileId]);
        const completedTypes = completed.map(f => f.agreement_type);

        const allCompleted = requiredForms.every(type => completedTypes.includes(type));

        if (!allCompleted) {
            return res.status(400).json({
                success: false,
                error: 'All required forms must be completed before finalizing'
            });
        }

        // Update compliance status to compliant
        const updateQuery = `
            UPDATE contractor_compliance
            SET compliance_status = 'compliant',
                w9_completed = TRUE,
                nda_signed = TRUE,
                contractor_agreement_signed = TRUE,
                updated_at = NOW()
            WHERE creator_profile_id = ?
        `;

        await Database.query(updateQuery, [creatorProfileId]);

        // Update creator profile status to approved if pending
        const approveQuery = `
            UPDATE user_creator_profiles
            SET approval_status = 'approved',
                approved_at = NOW(),
                updated_at = NOW()
            WHERE id = ? AND approval_status = 'pending'
        `;

        await Database.query(approveQuery, [creatorProfileId]);

        res.json({
            success: true,
            message: 'Contractor onboarding completed successfully'
        });
    } catch (error) {
        console.error('Error finalizing contractor onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to finalize onboarding'
        });
    }
});

// Admin: Get all contractor agreements
router.get('/admin/contractor-agreements', async (req, res) => {
    try {
        const query = `
            SELECT 
                ca.*,
                ucp.creator_name,
                u.email,
                cc.compliance_status
            FROM contractor_agreements ca
            LEFT JOIN user_creator_profiles ucp ON ca.creator_profile_id = ucp.id
            LEFT JOIN users u ON ucp.user_id = u.id
            LEFT JOIN contractor_compliance cc ON ca.creator_profile_id = cc.creator_profile_id
            ORDER BY ca.created_at DESC
        `;

        const agreements = await Database.query(query);

        res.json({
            success: true,
            agreements
        });
    } catch (error) {
        console.error('Error fetching contractor agreements:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch agreements'
        });
    }
});

// Admin: Send contractor forms link
router.post('/admin/send-contractor-link', async (req, res) => {
    try {
        const { creatorProfileId, email } = req.body;

        if (!creatorProfileId || !email) {
            return res.status(400).json({
                success: false,
                error: 'Creator profile ID and email are required'
            });
        }

        // Generate unique token for the forms link
        const token = generateContractorToken(creatorProfileId);
        const formsLink = `${req.protocol}://${req.get('host')}/modules/influencers/contractor/contractor_forms.html?token=${token}`;

        // TODO: Send email with forms link
        // For now, just return the link
        
        res.json({
            success: true,
            message: 'Contractor forms link generated',
            formsLink
        });
    } catch (error) {
        console.error('Error sending contractor link:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send contractor link'
        });
    }
});

// Helper function to update compliance status
async function updateComplianceStatus(creatorProfileId, agreementType) {
    const complianceFields = {
        'w9': 'w9_completed = TRUE, w9_completed_at = NOW()',
        'nda': 'nda_signed = TRUE, nda_signed_at = NOW()',
        'independent_contractor': 'contractor_agreement_signed = TRUE, contractor_agreement_signed_at = NOW()'
    };

    if (complianceFields[agreementType]) {
        const query = `
            INSERT INTO contractor_compliance (creator_profile_id, ${complianceFields[agreementType]}, updated_at)
            VALUES (?, NOW())
            ON DUPLICATE KEY UPDATE
                ${complianceFields[agreementType]},
                updated_at = NOW()
        `;

        await Database.query(query, [creatorProfileId]);
    }
}

// Helper function to generate contractor token
function generateContractorToken(creatorProfileId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return Buffer.from(`${creatorProfileId}:${timestamp}:${random}`).toString('base64');
}

module.exports = router;