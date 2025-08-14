-- Lucy AI Database Schema
-- Date: December 19, 2024
-- Purpose: Support Lucy AI Core functionality for KTG.IO platform

-- Lucy AI Character Configuration
CREATE TABLE ai_characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL DEFAULT 'Lucy',
    role ENUM('co_host', 'viral_promoter', 'enterprise_automation', 'user_acquisition') NOT NULL DEFAULT 'co_host',
    personality_data JSON,
    social_capabilities JSON,
    external_integrations JSON,
    status ENUM('idle', 'active', 'paused', 'error') DEFAULT 'idle',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- External Platform Campaigns
CREATE TABLE external_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    platform ENUM('twitter', 'instagram', 'tiktok', 'youtube', 'facebook', 'linkedin') NOT NULL,
    campaign_type ENUM('user_acquisition', 'viral_promotion', 'door_invitation', 'content_creation') NOT NULL,
    door_theme ENUM('Destiny', 'Chess', 'Music', 'Ideas', 'AI Chat') NOT NULL,
    content_data JSON,
    engagement_metrics JSON,
    target_audience VARCHAR(255),
    status ENUM('active', 'paused', 'completed', 'failed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id) ON DELETE CASCADE
);

-- Door Invitation Tracking
CREATE TABLE door_invitations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    source_platform VARCHAR(50) NOT NULL,
    campaign_id INT NULL,
    door_presented JSON,
    door_chosen VARCHAR(50) NULL,
    conversion_completed BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    referrer_url TEXT,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id) ON DELETE SET NULL
);

-- Platform Connection Status
CREATE TABLE platform_connections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    connection_status ENUM('connected', 'disconnected', 'error', 'pending') DEFAULT 'disconnected',
    api_credentials JSON,
    last_activity TIMESTAMP NULL,
    metrics JSON,
    error_log TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_lucy_platform (lucy_id, platform)
);

-- Generated Content Archive
CREATE TABLE generated_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    campaign_id INT NULL,
    platform VARCHAR(50) NOT NULL,
    door_theme VARCHAR(50) NOT NULL,
    content_type ENUM('post', 'story', 'video', 'image', 'carousel') NOT NULL,
    content_text TEXT,
    media_urls JSON,
    hashtags JSON,
    call_to_action TEXT,
    engagement_metrics JSON,
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id) ON DELETE SET NULL
);

-- AI Agent Integration Status
CREATE TABLE ai_integrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    integration_type ENUM('riona', 'notte', 'custom') NOT NULL,
    integration_name VARCHAR(100) NOT NULL,
    status ENUM('connected', 'disconnected', 'error') DEFAULT 'disconnected',
    config_data JSON,
    last_sync TIMESTAMP NULL,
    error_log TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id) ON DELETE CASCADE
);

-- Insert default Lucy AI character
INSERT INTO ai_characters (name, role, personality_data, social_capabilities, external_integrations) VALUES (
    'Lucy',
    'co_host',
    JSON_OBJECT(
        'tone', 'friendly_engaging',
        'style', 'viral_content_creator',
        'expertise', JSON_ARRAY('gaming', 'social_media', 'user_acquisition'),
        'voice', 'enthusiastic_guide'
    ),
    JSON_OBJECT(
        'viral_content_creation', true,
        'user_acquisition', true,
        'door_presentation', true,
        'external_platform_integration', true
    ),
    JSON_OBJECT(
        'riona_integration', true,
        'notte_automation', true,
        'platforms', JSON_ARRAY('twitter', 'instagram', 'tiktok', 'youtube', 'facebook')
    )
);

-- Create indexes for performance
CREATE INDEX idx_campaigns_platform_status ON external_campaigns(platform, status);
CREATE INDEX idx_invitations_source_platform ON door_invitations(source_platform);
CREATE INDEX idx_invitations_conversion ON door_invitations(conversion_completed);
CREATE INDEX idx_content_platform_theme ON generated_content(platform, door_theme);
CREATE INDEX idx_connections_status ON platform_connections(connection_status);