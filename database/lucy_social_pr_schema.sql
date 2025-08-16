-- Lucy AI Social Networks and PR Firms Tracking Schema
-- Date: December 19, 2024
-- Purpose: Track social networks, PR firms, and campaign actions with receipts

-- Social Networks Configuration
CREATE TABLE lucy_social_networks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    platform_name VARCHAR(100) NOT NULL,
    platform_type ENUM('social_media', 'gaming', 'tech', 'news', 'video', 'podcast') NOT NULL,
    api_endpoint VARCHAR(500),
    api_credentials JSON,
    connection_status ENUM('connected', 'disconnected', 'pending', 'error') DEFAULT 'disconnected',
    posting_enabled BOOLEAN DEFAULT FALSE,
    auto_posting BOOLEAN DEFAULT FALSE,
    daily_post_limit INT DEFAULT 10,
    rate_limit_per_hour INT DEFAULT 5,
    optimal_posting_times JSON, -- Array of hours like [9, 12, 15, 18]
    hashtag_strategy JSON,
    content_templates JSON,
    engagement_metrics JSON,
    last_post_at TIMESTAMP NULL,
    last_sync_at TIMESTAMP NULL,
    error_log TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PR Firms and Media Contacts
CREATE TABLE lucy_pr_firms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firm_name VARCHAR(200) NOT NULL,
    firm_type ENUM('pr_agency', 'media_outlet', 'journalist', 'influencer', 'blogger', 'podcaster') NOT NULL,
    contact_person VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(500),
    social_handles JSON, -- {twitter: @handle, linkedin: url, etc}
    specialties JSON, -- Array of specialties like ['gaming', 'blockchain', 'tech']
    tier ENUM('tier_1', 'tier_2', 'tier_3', 'local', 'niche') DEFAULT 'tier_3',
    reach_estimate INT, -- Estimated audience size
    engagement_rate DECIMAL(5,2), -- Percentage
    previous_coverage JSON, -- Array of previous articles/mentions
    contact_preferences JSON, -- Preferred contact methods and times
    media_kit_url VARCHAR(500),
    rate_card JSON, -- Pricing information if available
    relationship_status ENUM('cold', 'warm', 'active', 'partner', 'blacklisted') DEFAULT 'cold',
    last_contact_date DATE,
    next_follow_up_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Campaign Actions and Tasks
CREATE TABLE lucy_campaign_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT,
    action_type ENUM('email_sent', 'social_post', 'press_release', 'follow_up', 'meeting_scheduled', 'content_created', 'media_kit_sent') NOT NULL,
    target_type ENUM('pr_firm', 'social_network', 'influencer', 'media_outlet') NOT NULL,
    target_id INT, -- References lucy_pr_firms or lucy_social_networks
    action_title VARCHAR(255) NOT NULL,
    action_description TEXT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    assigned_to VARCHAR(100), -- Team member or 'Lucy AI'
    due_date DATETIME,
    completed_at TIMESTAMP NULL,
    action_taken BOOLEAN DEFAULT FALSE,
    receipt_received BOOLEAN DEFAULT FALSE,
    receipt_url VARCHAR(500),
    receipt_notes TEXT,
    response_received BOOLEAN DEFAULT FALSE,
    response_content TEXT,
    response_date TIMESTAMP NULL,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    automation_data JSON, -- Data for automated actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id) ON DELETE SET NULL
);

-- Action Receipts and Confirmations
CREATE TABLE lucy_action_receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action_id INT NOT NULL,
    receipt_type ENUM('email_delivery', 'social_post_confirmation', 'meeting_confirmation', 'payment_receipt', 'media_coverage', 'response_received') NOT NULL,
    receipt_data JSON, -- Structured data about the receipt
    receipt_url VARCHAR(500),
    receipt_file_path VARCHAR(500),
    confirmation_code VARCHAR(100),
    external_reference VARCHAR(200), -- External system reference ID
    verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (action_id) REFERENCES lucy_campaign_actions(id) ON DELETE CASCADE
);

-- Social Media Posts Tracking
CREATE TABLE lucy_social_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    network_id INT NOT NULL,
    campaign_id INT,
    post_type ENUM('text', 'image', 'video', 'carousel', 'story', 'reel') NOT NULL,
    content TEXT NOT NULL,
    media_urls JSON,
    hashtags JSON,
    scheduled_for TIMESTAMP,
    posted_at TIMESTAMP NULL,
    external_post_id VARCHAR(200), -- Platform's post ID
    post_url VARCHAR(500),
    engagement_metrics JSON, -- likes, shares, comments, views
    reach_metrics JSON,
    status ENUM('draft', 'scheduled', 'posted', 'failed', 'deleted') DEFAULT 'draft',
    error_message TEXT,
    boost_budget DECIMAL(10,2) DEFAULT 0.00,
    boost_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (network_id) REFERENCES lucy_social_networks(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id) ON DELETE SET NULL
);

-- Email Campaigns Tracking
CREATE TABLE lucy_email_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pr_firm_id INT NOT NULL,
    campaign_id INT,
    email_type ENUM('press_pitch', 'follow_up', 'media_kit', 'invitation', 'thank_you', 'product_announcement') NOT NULL,
    subject_line VARCHAR(255) NOT NULL,
    email_content TEXT NOT NULL,
    template_used VARCHAR(100),
    personalization_data JSON,
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP NULL,
    delivery_status ENUM('pending', 'sent', 'delivered', 'bounced', 'failed') DEFAULT 'pending',
    opened_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    replied_at TIMESTAMP NULL,
    reply_content TEXT,
    tracking_pixel_url VARCHAR(500),
    unsubscribed BOOLEAN DEFAULT FALSE,
    spam_reported BOOLEAN DEFAULT FALSE,
    follow_up_scheduled BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pr_firm_id) REFERENCES lucy_pr_firms(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id) ON DELETE SET NULL
);

-- Insert default social networks
INSERT INTO lucy_social_networks (platform_name, platform_type, daily_post_limit, rate_limit_per_hour, optimal_posting_times, hashtag_strategy) VALUES
('Twitter/X', 'social_media', 15, 3, JSON_ARRAY(9, 12, 15, 18, 21), JSON_OBJECT('max_hashtags', 3, 'trending_focus', true)),
('Instagram', 'social_media', 3, 1, JSON_ARRAY(11, 14, 19), JSON_OBJECT('max_hashtags', 10, 'visual_focus', true)),
('TikTok', 'video', 5, 2, JSON_ARRAY(12, 16, 20), JSON_OBJECT('max_hashtags', 5, 'viral_focus', true)),
('YouTube', 'video', 1, 1, JSON_ARRAY(14, 18), JSON_OBJECT('max_hashtags', 15, 'seo_focus', true)),
('LinkedIn', 'social_media', 5, 2, JSON_ARRAY(8, 12, 17), JSON_OBJECT('max_hashtags', 5, 'professional_focus', true)),
('Discord', 'gaming', 20, 5, JSON_ARRAY(10, 14, 18, 22), JSON_OBJECT('community_focus', true)),
('Reddit', 'social_media', 10, 2, JSON_ARRAY(10, 14, 20), JSON_OBJECT('subreddit_focus', true)),
('Twitch', 'gaming', 5, 1, JSON_ARRAY(15, 19, 21), JSON_OBJECT('streaming_focus', true));

-- Insert sample PR firms from Lucy's research
INSERT INTO lucy_pr_firms (firm_name, firm_type, contact_person, email, specialties, tier, reach_estimate, relationship_status) VALUES
('TechCrunch', 'media_outlet', 'Gaming Editor', 'tips@techcrunch.com', JSON_ARRAY('gaming', 'blockchain', 'startups'), 'tier_1', 10000000, 'cold'),
('VentureBeat', 'media_outlet', 'Gaming Reporter', 'news@venturebeat.com', JSON_ARRAY('gaming', 'tech', 'ai'), 'tier_1', 5000000, 'cold'),
('GamesBeat', 'media_outlet', 'Editor', 'tips@gamesbeat.com', JSON_ARRAY('gaming', 'esports', 'mobile'), 'tier_2', 2000000, 'cold'),
('Polygon', 'media_outlet', 'News Editor', 'tips@polygon.com', JSON_ARRAY('gaming', 'culture', 'indie'), 'tier_2', 3000000, 'cold'),
('IGN', 'media_outlet', 'News Team', 'news@ign.com', JSON_ARRAY('gaming', 'entertainment', 'reviews'), 'tier_1', 15000000, 'cold'),
('GameSpot', 'media_outlet', 'Editorial', 'news@gamespot.com', JSON_ARRAY('gaming', 'reviews', 'esports'), 'tier_2', 8000000, 'cold'),
('Kotaku', 'media_outlet', 'Tips', 'tips@kotaku.com', JSON_ARRAY('gaming', 'culture', 'indie'), 'tier_2', 4000000, 'cold'),
('The Verge', 'media_outlet', 'Gaming Editor', 'tips@theverge.com', JSON_ARRAY('tech', 'gaming', 'culture'), 'tier_1', 12000000, 'cold');

-- Create indexes for performance
CREATE INDEX idx_social_networks_platform ON lucy_social_networks(platform_name);
CREATE INDEX idx_social_networks_status ON lucy_social_networks(connection_status);
CREATE INDEX idx_pr_firms_type ON lucy_pr_firms(firm_type);
CREATE INDEX idx_pr_firms_tier ON lucy_pr_firms(tier);
CREATE INDEX idx_pr_firms_relationship ON lucy_pr_firms(relationship_status);
CREATE INDEX idx_campaign_actions_status ON lucy_campaign_actions(status);
CREATE INDEX idx_campaign_actions_due_date ON lucy_campaign_actions(due_date);
CREATE INDEX idx_campaign_actions_target ON lucy_campaign_actions(target_type, target_id);
CREATE INDEX idx_action_receipts_type ON lucy_action_receipts(receipt_type);
CREATE INDEX idx_social_posts_network ON lucy_social_posts(network_id);
CREATE INDEX idx_social_posts_status ON lucy_social_posts(status);
CREATE INDEX idx_email_campaigns_pr_firm ON lucy_email_campaigns(pr_firm_id);
CREATE INDEX idx_email_campaigns_status ON lucy_email_campaigns(delivery_status);