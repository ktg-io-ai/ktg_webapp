-- KTG Local Development Database Schema
-- Complete schema with Lucy AI and enhanced features

-- Countries table
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL,
    phone_code VARCHAR(10)
);

-- Enhanced Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country_id INT,
    tagline VARCHAR(255),
    about_me TEXT,
    location VARCHAR(255),
    birth_date DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    relationship_status ENUM('single', 'taken', 'married', 'complicated', 'open'),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_visibility ENUM('public', 'friends', 'private') DEFAULT 'public',
    last_active TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Gaming System
CREATE TABLE user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_type ENUM('1life', '3life', '6life', '9life', 'diamond', 'chess_ai', 'premium') NOT NULL,
    quantity INT DEFAULT 0,
    purchase_price DECIMAL(10,2),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE destiny_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_name VARCHAR(100),
    lives_used INT NOT NULL,
    doors_chosen JSON,
    door_results JSON,
    final_outcome ENUM('win', 'lose', 'abandoned', 'in_progress') DEFAULT 'in_progress',
    tokens_won INT DEFAULT 0,
    session_data JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chess_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    opponent_type ENUM('ai', 'human') NOT NULL,
    opponent_user_id INT,
    ai_difficulty ENUM('beginner', 'intermediate', 'advanced', 'master'),
    game_state JSON,
    result ENUM('win', 'lose', 'draw', 'abandoned', 'in_progress') DEFAULT 'in_progress',
    moves_count INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Lucy AI System
CREATE TABLE ai_characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL DEFAULT 'Lucy',
    role ENUM('co_host', 'viral_promoter', 'enterprise_automation') NOT NULL,
    personality_data JSON,
    social_capabilities JSON,
    external_integrations JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE external_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lucy_id INT NOT NULL,
    platform ENUM('twitter', 'instagram', 'tiktok', 'youtube', 'facebook', 'linkedin') NOT NULL,
    campaign_type ENUM('user_acquisition', 'viral_promotion', 'door_invitation') NOT NULL,
    content_data JSON,
    engagement_metrics JSON,
    status ENUM('active', 'paused', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lucy_id) REFERENCES ai_characters(id)
);

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

-- Social Features
CREATE TABLE user_connections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    requester_id INT NOT NULL,
    addressee_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked', 'declined') DEFAULT 'pending',
    connection_type ENUM('friend', 'follower', 'blocked') DEFAULT 'friend',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_connection (requester_id, addressee_id)
);

CREATE TABLE chat_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('direct', 'group') NOT NULL,
    name VARCHAR(100),
    creator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_type ENUM('text', 'image', 'video', 'audio', 'file', 'emoji') DEFAULT 'text',
    content TEXT,
    media_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ideas & Experiences
CREATE TABLE ideas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image VARCHAR(255),
    cost_range ENUM('free', 'low', 'medium', 'high', 'luxury') DEFAULT 'medium',
    cost_details VARCHAR(100),
    start_date DATE,
    end_date DATE,
    category ENUM('entertainment', 'dining', 'adventure', 'culture', 'nightlife', 'sports', 'wellness', 'education') DEFAULT 'entertainment',
    tags JSON,
    is_active BOOLEAN DEFAULT TRUE,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Data
INSERT INTO countries (name, code, phone_code) VALUES
('United States', 'US', '+1'),
('Canada', 'CA', '+1'),
('United Kingdom', 'GB', '+44'),
('Australia', 'AU', '+61'),
('Germany', 'DE', '+49');

INSERT INTO ai_characters (name, role, personality_data, social_capabilities) VALUES
('Lucy', 'co_host', 
JSON_OBJECT('engaging', true, 'viral_savvy', true, 'door_presenter', true),
JSON_OBJECT('twitter', true, 'instagram', true, 'tiktok', true, 'youtube', true));