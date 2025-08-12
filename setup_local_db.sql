-- KTG Local Development Database Setup
-- Run this in phpMyAdmin or MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS ktg_local_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ktg_local_dev;

-- Countries table
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL,
    phone_code VARCHAR(10)
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Gaming tokens
CREATE TABLE user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_type ENUM('1life', '3life', '6life', '9life', 'diamond', 'chess_ai', 'premium') NOT NULL,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Destiny game sessions
CREATE TABLE destiny_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_name VARCHAR(100),
    lives_used INT NOT NULL,
    doors_chosen JSON,
    door_results JSON,
    final_outcome ENUM('win', 'lose', 'abandoned', 'in_progress') DEFAULT 'in_progress',
    tokens_won INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lucy AI character
CREATE TABLE ai_characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL DEFAULT 'Lucy',
    role ENUM('co_host', 'viral_promoter', 'enterprise_automation') NOT NULL,
    personality_data JSON,
    social_capabilities JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External campaigns
CREATE TABLE external_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    platform ENUM('twitter', 'instagram', 'tiktok', 'youtube', 'facebook', 'linkedin') NOT NULL,
    campaign_type ENUM('user_acquisition', 'viral_promotion', 'door_invitation') NOT NULL,
    content_data JSON,
    status ENUM('active', 'paused', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id)
);

-- Door invitations tracking
CREATE TABLE door_invitations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    source_platform VARCHAR(50),
    campaign_id INT,
    door_presented JSON,
    door_chosen VARCHAR(50),
    conversion_completed BOOLEAN DEFAULT FALSE,
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (campaign_id) REFERENCES external_campaigns(id)
);

-- Sample data
INSERT INTO countries (name, code, phone_code) VALUES
('United States', 'US', '+1'),
('Canada', 'CA', '+1'),
('United Kingdom', 'GB', '+44');

INSERT INTO ai_characters (name, role, personality_data, social_capabilities) VALUES
('Lucy', 'co_host', 
'{"engaging": true, "viral_savvy": true, "door_presenter": true}',
'{"twitter": true, "instagram": true, "tiktok": true, "youtube": true}');