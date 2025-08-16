-- Lucy AI Investor Campaign Schema
-- Date: December 19, 2024

-- Investor Lists and Contacts
CREATE TABLE lucy_investors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    investor_name VARCHAR(200) NOT NULL,
    investor_type ENUM('vc_firm', 'angel_investor', 'family_office', 'corporate_vc', 'accelerator', 'incubator', 'private_equity') NOT NULL,
    contact_person VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    investment_focus JSON, -- Array like ['gaming', 'blockchain', 'ai', 'saas']
    investment_stage ENUM('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'all_stages') DEFAULT 'seed',
    investment_range_min DECIMAL(15,2), -- Minimum investment amount
    investment_range_max DECIMAL(15,2), -- Maximum investment amount
    portfolio_companies JSON, -- Array of portfolio company names
    geographic_focus JSON, -- Array like ['north_america', 'europe', 'asia']
    relationship_status ENUM('cold', 'warm', 'active', 'partner', 'declined', 'blacklisted') DEFAULT 'cold',
    last_contact_date DATE,
    next_follow_up_date DATE,
    pitch_deck_sent BOOLEAN DEFAULT FALSE,
    pitch_deck_sent_date DATE,
    meeting_scheduled BOOLEAN DEFAULT FALSE,
    meeting_date DATETIME,
    investment_interest_level ENUM('none', 'low', 'medium', 'high', 'very_high') DEFAULT 'none',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Investor Campaign Actions
CREATE TABLE lucy_investor_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type ENUM('pitch_deck', 'follow_up', 'demo_request', 'meeting_request', 'update_email', 'thank_you') NOT NULL,
    target_investor_type JSON, -- Array of investor types to target
    target_investment_stage JSON, -- Array of investment stages
    email_subject VARCHAR(255),
    email_template TEXT,
    mailgun_template_id VARCHAR(100),
    scheduled_send_date DATETIME,
    status ENUM('draft', 'scheduled', 'sending', 'sent', 'completed', 'paused', 'cancelled') DEFAULT 'draft',
    total_recipients INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    emails_delivered INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    emails_clicked INT DEFAULT 0,
    responses_received INT DEFAULT 0,
    meetings_scheduled INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mailgun Email Tracking
CREATE TABLE lucy_mailgun_emails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT NOT NULL,
    campaign_id INT,
    mailgun_message_id VARCHAR(255),
    recipient_email VARCHAR(255) NOT NULL,
    subject_line VARCHAR(255),
    email_content TEXT,
    sent_at TIMESTAMP,
    delivery_status ENUM('sending', 'delivered', 'failed', 'bounced', 'complained', 'unsubscribed') DEFAULT 'sending',
    delivered_at TIMESTAMP NULL,
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    bounced_at TIMESTAMP NULL,
    complained_at TIMESTAMP NULL,
    unsubscribed_at TIMESTAMP NULL,
    failure_reason TEXT,
    tracking_events JSON, -- Store all Mailgun webhook events
    response_received BOOLEAN DEFAULT FALSE,
    response_content TEXT,
    response_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES lucy_investors(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES lucy_investor_campaigns(id) ON DELETE SET NULL
);

-- Mailgun Configuration
CREATE TABLE lucy_mailgun_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    webhook_signing_key VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    daily_send_limit INT DEFAULT 300,
    monthly_send_limit INT DEFAULT 10000,
    emails_sent_today INT DEFAULT 0,
    emails_sent_this_month INT DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample investors
INSERT INTO lucy_investors (investor_name, investor_type, contact_person, email, investment_focus, investment_stage, investment_range_min, investment_range_max, geographic_focus, relationship_status) VALUES
('Andreessen Horowitz', 'vc_firm', 'Gaming Partner', 'gaming@a16z.com', JSON_ARRAY('gaming', 'blockchain', 'ai'), 'series_a', 1000000, 50000000, JSON_ARRAY('north_america'), 'cold'),
('Sequoia Capital', 'vc_firm', 'Partner', 'contact@sequoiacap.com', JSON_ARRAY('gaming', 'saas', 'consumer'), 'seed', 500000, 25000000, JSON_ARRAY('north_america', 'asia'), 'cold'),
('Accel Partners', 'vc_firm', 'Gaming Lead', 'gaming@accel.com', JSON_ARRAY('gaming', 'mobile', 'social'), 'seed', 250000, 15000000, JSON_ARRAY('north_america', 'europe'), 'cold'),
('Bitkraft Ventures', 'vc_firm', 'Investment Team', 'hello@bitkraft.vc', JSON_ARRAY('gaming', 'esports', 'blockchain'), 'seed', 100000, 10000000, JSON_ARRAY('north_america', 'europe'), 'cold'),
('Griffin Gaming Partners', 'vc_firm', 'Partner', 'contact@griffingp.com', JSON_ARRAY('gaming', 'interactive_media'), 'series_a', 1000000, 30000000, JSON_ARRAY('north_america'), 'cold'),
('Makers Fund', 'vc_firm', 'Investment Partner', 'hello@makersfund.com', JSON_ARRAY('gaming', 'interactive_entertainment'), 'seed', 500000, 20000000, JSON_ARRAY('north_america', 'asia'), 'cold'),
('Play Ventures', 'vc_firm', 'Managing Partner', 'contact@play.vc', JSON_ARRAY('gaming', 'mobile_gaming'), 'seed', 250000, 5000000, JSON_ARRAY('europe', 'asia'), 'cold'),
('Hiro Capital', 'vc_firm', 'Partner', 'contact@hiro.capital', JSON_ARRAY('gaming', 'esports', 'digital_sports'), 'seed', 500000, 15000000, JSON_ARRAY('europe'), 'cold');

-- Insert Mailgun configuration
INSERT INTO lucy_mailgun_config (config_name, api_key, domain, from_email, from_name, daily_send_limit, monthly_send_limit) VALUES
('KTG Investor Outreach', 'c1aa02ab8c46d299c767bc0fa811f446-51afd2db-d4341025', 'sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org', 'postmaster@sandbox9d0dd225b14645a28da1c8cbc6b33618.mailgun.org', 'KTG Team', 300, 10000);

-- Create indexes
CREATE INDEX idx_investors_type ON lucy_investors(investor_type);
CREATE INDEX idx_investors_stage ON lucy_investors(investment_stage);
CREATE INDEX idx_investors_relationship ON lucy_investors(relationship_status);
CREATE INDEX idx_investor_campaigns_status ON lucy_investor_campaigns(status);
CREATE INDEX idx_mailgun_emails_status ON lucy_mailgun_emails(delivery_status);
CREATE INDEX idx_mailgun_emails_investor ON lucy_mailgun_emails(investor_id);