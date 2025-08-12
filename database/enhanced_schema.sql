-- Enhanced KTG Platform Database Schema
-- Modern comprehensive structure incorporating social gaming, avatars, experiences, and community features
-- Built on existing KTG webapp structure with enhanced social platform capabilities

-- ============================================================================
-- CORE USER SYSTEM
-- ============================================================================

-- Countries table (must be created first due to foreign key)
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL,
    phone_code VARCHAR(10)
);

-- Enhanced Users Table with comprehensive profile system
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

-- Avatar Groups
CREATE TABLE avatar_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    description TEXT,
    sort_order INT DEFAULT 0
);

-- Enhanced User Avatars
CREATE TABLE user_avatars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    avatar_name VARCHAR(100),
    avatar_group_id INT,
    avatar_data JSON NOT NULL,
    avatar_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (avatar_group_id) REFERENCES avatar_groups(id)
);

-- ============================================================================
-- GAMING SYSTEM
-- ============================================================================

-- Enhanced Token System
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

-- Enhanced Destiny Game Sessions
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

-- Enhanced Chess Game Sessions
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

-- ============================================================================
-- SOCIAL FEATURES
-- ============================================================================

-- Friend/Connection System
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

-- Chat Conversations
CREATE TABLE chat_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('direct', 'group') NOT NULL,
    name VARCHAR(100),
    creator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Enhanced Chat Messages
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

-- ============================================================================
-- IDEAS & EXPERIENCES
-- ============================================================================

-- Enhanced Ideas/Experiences
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

-- User Bucket List
CREATE TABLE user_bucket_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    idea_id INT NOT NULL,
    status ENUM('want_to_do', 'planning', 'completed', 'not_interested') DEFAULT 'want_to_do',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_idea (user_id, idea_id)
);

-- ============================================================================
-- JOURNEYBOOK SYSTEM
-- ============================================================================

-- JourneyBook Categories
CREATE TABLE journeybook_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    sort_order INT DEFAULT 0
);

-- JourneyBook Questions
CREATE TABLE journeybook_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'multiple_choice', 'rating', 'boolean') DEFAULT 'text',
    options JSON,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES journeybook_categories(id)
);

-- Enhanced JourneyBook Responses
CREATE TABLE journeybook_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    answer TEXT,
    numeric_value INT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES journeybook_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_question (user_id, question_id)
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- System Settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Sessions
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet_id ON users(wallet_id);
CREATE INDEX idx_user_tokens_user ON user_tokens(user_id);
CREATE INDEX idx_destiny_sessions_user ON destiny_sessions(user_id);
CREATE INDEX idx_chess_sessions_user ON chess_sessions(user_id);
CREATE INDEX idx_ideas_user ON ideas(user_id);
CREATE INDEX idx_bucket_list_user ON user_bucket_list(user_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default countries
INSERT INTO countries (name, code, phone_code) VALUES 
('United States', 'US', '+1'),
('Canada', 'CA', '+1'),
('United Kingdom', 'GB', '+44'),
('Philippines', 'PH', '+63');

-- Insert avatar groups
INSERT INTO avatar_groups (name, color, description, sort_order) VALUES
('Compatibility', '#D0CF65', 'Compatibility traits', 1),
('Values', '#65B9D0', 'Personal values', 2),
('Intimacy', '#D06581', 'Intimacy preferences', 3);

-- Insert JourneyBook categories
INSERT INTO journeybook_categories (name, color, sort_order) VALUES
('Personal Values', '#65B9D0', 1),
('Compatibility', '#D0CF65', 2),
('Intimacy & Relationships', '#D06581', 3);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Karma the Game', 'Site name'),
('token_prices', '{"1life": 1.99, "3life": 4.99, "6life": 7.99, "9life": 9.99}', 'Token pricing'),
('max_lives_per_session', '9', 'Max lives per Destiny session');