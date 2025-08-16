// Mailgun Service for Lucy AI
// Date: December 19, 2024

class MailgunService {
    constructor() {
        this.apiKey = 'c1aa02ab8c46d299c767bc0fa811f446-51afd2db-d4341025';
        this.domain = 'sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org';
        this.baseUrl = 'https://api.mailgun.net/v3';
        this.fromEmail = 'KTG Team <postmaster@sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org>';
    }

    async sendEmail(to, subject, text, html = null) {
        const formData = new FormData();
        formData.append('from', this.fromEmail);
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('text', text);
        if (html) formData.append('html', html);

        try {
            const response = await fetch(`${this.baseUrl}/${this.domain}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`api:${this.apiKey}`)
                },
                body: formData
            });

            const result = await response.json();
            return {
                success: response.ok,
                messageId: result.id,
                message: result.message,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendInvestorPitch(investorEmail, investorName, campaignType = 'pitch_deck') {
        const templates = {
            pitch_deck: {
                subject: `KTG.io - Revolutionary Gaming Platform Investment Opportunity`,
                text: `Dear ${investorName},

I hope this email finds you well. I'm reaching out to introduce KTG.io, a groundbreaking gaming platform that's redefining how players interact with games through AI-powered avatars and blockchain technology.

🎮 What is KTG.io?
KTG.io is an innovative gaming ecosystem that combines:
- AI-powered avatar generation with Leonardo AI
- Multi-door gaming experiences (Destiny, Chess, Music, Ideas)
- Blockchain integration for true digital ownership
- Social features and community building
- Cross-platform compatibility

💰 Investment Opportunity:
We're currently raising our seed round to accelerate development and user acquisition. Our platform has shown strong early traction with unique user engagement metrics.

📊 Key Metrics:
- Unique gaming concept with AI integration
- Multiple revenue streams (gaming, NFTs, subscriptions)
- Experienced team with gaming and blockchain expertise
- Clear path to monetization and scale

I'd love to schedule a brief call to discuss this opportunity further and share our pitch deck with you.

Would you be available for a 15-minute call this week?

Best regards,
The KTG Team

P.S. You can learn more about our platform at https://ktg.io`
            },
            follow_up: {
                subject: `Following up - KTG.io Investment Opportunity`,
                text: `Hi ${investorName},

I wanted to follow up on my previous email about KTG.io's investment opportunity. 

We've made significant progress since our last communication and would love to update you on our latest developments and metrics.

Would you be interested in a quick 10-minute call to discuss?

Best regards,
The KTG Team`
            },
            demo_request: {
                subject: `KTG.io Live Demo - See Our Gaming Platform in Action`,
                text: `Dear ${investorName},

Thank you for your interest in KTG.io! 

I'd like to invite you to a personalized demo of our gaming platform where you can:
- Experience our AI avatar generation
- Try our multi-door gaming system
- See our blockchain integration in action
- Understand our monetization strategy

The demo takes about 20 minutes and can be scheduled at your convenience.

When would work best for you?

Best regards,
The KTG Team`
            }
        };

        const template = templates[campaignType] || templates.pitch_deck;
        return await this.sendEmail(investorEmail, template.subject, template.text);
    }

    async sendBulkEmails(recipients, subject, text, html = null) {
        const results = [];
        
        for (const recipient of recipients) {
            const result = await this.sendEmail(recipient.email, subject, text, html);
            results.push({
                email: recipient.email,
                name: recipient.name,
                success: result.success,
                messageId: result.messageId,
                error: result.error
            });
            
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    }

    async getEmailStats(messageId) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.domain}/events?message-id=${messageId}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`api:${this.apiKey}`)
                }
            });
            
            const result = await response.json();
            return {
                success: response.ok,
                events: result.items || []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MailgunService;
} else {
    window.MailgunService = MailgunService;
}