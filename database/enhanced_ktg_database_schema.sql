-- Enhanced KTG Platform Database Schema
-- Modern comprehensive structure incorporating social gaming, avatars, experiences, and community features
-- Built on existing KTG webapp structure with enhanced social platform capabilities

-- ============================================================================
-- CORE USER SYSTEM
-- ============================================================================

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

-- Enhanced User Avatars with grouping system
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

-- Avatar Groups (Compatibility, Values, Intimacy, etc.)
CREATE TABLE avatar_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    description TEXT,
    sort_order INT DEFAULT 0
);

-- ============================================================================
-- SOCIAL CONNECTIONS & RELATIONSHIPS
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

-- User Groups/Communities
CREATE TABLE user_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id INT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    max_members INT DEFAULT 50,
    group_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Group Memberships
CREATE TABLE group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('member', 'moderator', 'admin') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (group_id, user_id)
);

-- ============================================================================
-- ENHANCED CHAT & MESSAGING SYSTEM
-- ============================================================================

-- Chat Conversations (1-on-1 and group chats)
CREATE TABLE chat_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('direct', 'group') NOT NULL,
    name VARCHAR(100), -- For group chats
    creator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Chat Participants
CREATE TABLE chat_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('member', 'admin') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (conversation_id, user_id)
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
    file_size INT,
    is_edited BOOLEAN DEFAULT FALSE,
    reply_to_message_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_message_id) REFERENCES chat_messages(id) ON DELETE SET NULL
);

-- Message Read Status
CREATE TABLE message_read_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_read_status (message_id, user_id)
);

-- ============================================================================
-- GAMING SYSTEM (DESTINY & CHESS)
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
    is_gift BOOLEAN DEFAULT FALSE,
    gift_from_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gift_from_user_id) REFERENCES users(id) ON DELETE SET NULL
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
    experience_points INT DEFAULT 0,
    session_data JSON,
    is_multiplayer BOOLEAN DEFAULT FALSE,
    multiplayer_session_id VARCHAR(50),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Multiplayer Destiny Sessions
CREATE TABLE destiny_multiplayer_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(50) UNIQUE NOT NULL,
    host_user_id INT NOT NULL,
    max_players INT DEFAULT 4,
    current_round INT DEFAULT 1,
    total_rounds INT DEFAULT 3,
    status ENUM('waiting', 'in_progress', 'completed') DEFAULT 'waiting',
    session_settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enhanced Chess Game Sessions
CREATE TABLE chess_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    opponent_type ENUM('ai', 'human') NOT NULL,
    opponent_user_id INT,
    ai_difficulty ENUM('beginner', 'intermediate', 'advanced', 'master'),
    game_state JSON,
    move_history JSON,
    result ENUM('win', 'lose', 'draw', 'abandoned', 'in_progress') DEFAULT 'in_progress',
    moves_count INT DEFAULT 0,
    time_control VARCHAR(20), -- e.g., "10+5" for 10 min + 5 sec increment
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (opponent_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- EXPERIENCES & IDEAS SYSTEM (Enhanced from old database)
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
    tags JSON, -- Array of tags for better categorization
    difficulty_level ENUM('easy', 'moderate', 'challenging', 'expert') DEFAULT 'moderate',
    group_size_min INT DEFAULT 1,
    group_size_max INT DEFAULT 10,
    age_restriction INT DEFAULT 0,
    external_link VARCHAR(500),
    contact_email VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    likes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Bucket List (Enhanced)
CREATE TABLE user_bucket_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    idea_id INT NOT NULL,
    status ENUM('want_to_do', 'planning', 'completed', 'not_interested') DEFAULT 'want_to_do',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    notes TEXT,
    planned_date DATE,
    completed_date DATE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_idea (user_id, idea_id)
);

-- Idea Likes/Reactions
CREATE TABLE idea_reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idea_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('like', 'love', 'wow', 'interested') DEFAULT 'like',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reaction (idea_id, user_id)
);

-- ============================================================================
-- JOURNEYBOOK SYSTEM (Enhanced from old database)
-- ============================================================================

-- JourneyBook Categories
CREATE TABLE journeybook_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    color VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (parent_category_id) REFERENCES journeybook_categories(id)
);

-- JourneyBook Questions
CREATE TABLE journeybook_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('text', 'multiple_choice', 'rating', 'boolean', 'date') DEFAULT 'text',
    options JSON, -- For multiple choice questions
    is_required BOOLEAN DEFAULT FALSE,
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
    numeric_value INT, -- For ratings
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES journeybook_questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_question (user_id, question_id)
);

-- ============================================================================
-- MUSIC & MEDIA SYSTEM
-- ============================================================================

-- Enhanced User Playlists
CREATE TABLE user_playlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    is_collaborative BOOLEAN DEFAULT FALSE,
    play_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enhanced Playlist Songs
CREATE TABLE playlist_songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlist_id INT NOT NULL,
    song_title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    album VARCHAR(255),
    duration INT, -- in seconds
    file_path VARCHAR(500),
    external_url VARCHAR(500),
    cover_art VARCHAR(255),
    order_index INT DEFAULT 0,
    added_by_user_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES user_playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- User Media Library
CREATE TABLE user_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    media_type ENUM('image', 'video', 'audio', 'document') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    thumbnail_path VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    tags JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- SOCIAL FEATURES
-- ============================================================================

-- User Posts/Updates
CREATE TABLE user_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    media_attachments JSON, -- Array of media IDs
    post_type ENUM('status', 'photo', 'video', 'link', 'achievement') DEFAULT 'status',
    privacy ENUM('public', 'friends', 'private') DEFAULT 'public',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Post Comments
CREATE TABLE post_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT, -- For nested comments
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES user_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES post_comments(id) ON DELETE CASCADE
);

-- Post Likes
CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES user_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_like (post_id, user_id)
);

-- User Achievements
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_type ENUM('first_login', 'profile_complete', 'first_friend', 'destiny_winner', 'chess_master', 'social_butterfly', 'explorer') NOT NULL,
    achievement_data JSON,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_displayed BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- NOTIFICATIONS SYSTEM
-- ============================================================================

-- User Notifications
CREATE TABLE user_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('friend_request', 'message', 'like', 'comment', 'achievement', 'game_invite', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    related_user_id INT,
    related_entity_type VARCHAR(50), -- 'post', 'message', 'game', etc.
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- Enhanced Countries
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL,
    phone_code VARCHAR(10),
    currency_code CHAR(3),
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- System Settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Sessions (Enhanced)
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin Users (Enhanced)
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator', 'support') DEFAULT 'admin',
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wallet_id ON users(wallet_id);
CREATE INDEX idx_users_last_active ON users(last_active);

-- Social connection indexes
CREATE INDEX idx_connections_requester ON user_connections(requester_id);
CREATE INDEX idx_connections_addressee ON user_connections(addressee_id);
CREATE INDEX idx_connections_status ON user_connections(status);

-- Chat indexes
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Gaming indexes
CREATE INDEX idx_destiny_sessions_user ON destiny_sessions(user_id);
CREATE INDEX idx_chess_sessions_user ON chess_sessions(user_id);
CREATE INDEX idx_user_tokens_user ON user_tokens(user_id);
CREATE INDEX idx_user_tokens_type ON user_tokens(token_type);

-- Ideas indexes
CREATE INDEX idx_ideas_user ON ideas(user_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_location ON ideas(location);
CREATE INDEX idx_ideas_featured ON ideas(is_featured);
CREATE INDEX idx_bucket_list_user ON user_bucket_list(user_id);

-- Social features indexes
CREATE INDEX idx_posts_user ON user_posts(user_id);
CREATE INDEX idx_posts_created ON user_posts(created_at);
CREATE INDEX idx_comments_post ON post_comments(post_id);
CREATE INDEX idx_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_notifications_unread ON user_notifications(user_id, is_read);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default countries
INSERT INTO countries (name, code, phone_code, currency_code, timezone) VALUES 
('United States', 'US', '+1', 'USD', 'America/New_York'),
('Canada', 'CA', '+1', 'CAD', 'America/Toronto'),
('United Kingdom', 'GB', '+44', 'GBP', 'Europe/London'),
('France', 'FR', '+33', 'EUR', 'Europe/Paris'),
('Germany', 'DE', '+49', 'EUR', 'Europe/Berlin'),
('Japan', 'JP', '+81', 'JPY', 'Asia/Tokyo'),
('Australia', 'AU', '+61', 'AUD', 'Australia/Sydney'),
('Philippines', 'PH', '+63', 'PHP', 'Asia/Manila');

-- Insert avatar groups
INSERT INTO avatar_groups (name, color, description, sort_order) VALUES
('Compatibility', '#D0CF65', 'Avatars representing compatibility traits', 1),
('Values', '#65B9D0', 'Avatars representing personal values', 2),
('Intimacy', '#D06581', 'Avatars representing intimacy preferences', 3);

-- Insert JourneyBook categories
INSERT INTO journeybook_categories (name, color, sort_order) VALUES
('Personal Values', '#65B9D0', 1),
('Compatibility', '#D0CF65', 2),
('Intimacy & Relationships', '#D06581', 3),
('Lifestyle & Interests', '#90EE90', 4),
('Goals & Aspirations', '#FFB6C1', 5);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Karma the Game', 'string', 'Site name', true),
('token_prices', '{"1life": 1.99, "3life": 4.99, "6life": 7.99, "9life": 9.99, "diamond": 19.99, "chess_ai": 1.99}', 'json', 'Token pricing in USD', true),
('max_lives_per_session', '9', 'number', 'Maximum lives allowed per Destiny session', true),
('chess_ai_difficulty', '{"beginner": 1, "intermediate": 2, "advanced": 3, "master": 4}', 'json', 'Chess AI difficulty levels', true),
('max_friends', '500', 'number', 'Maximum number of friends per user', true),
('max_group_members', '50', 'number', 'Maximum members per group', true),
('file_upload_max_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', false),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- User profile view with stats
CREATE VIEW user_profiles AS
SELECT 
    u.*,
    COUNT(DISTINCT uc1.id) as friends_count,
    COUNT(DISTINCT uc2.id) as followers_count,
    COUNT(DISTINCT up.id) as posts_count,
    COUNT(DISTINCT ua.id) as achievements_count
FROM users u
LEFT JOIN user_connections uc1 ON (u.id = uc1.requester_id OR u.id = uc1.addressee_id) 
    AND uc1.status = 'accepted' AND uc1.connection_type = 'friend'
LEFT JOIN user_connections uc2 ON u.id = uc2.addressee_id 
    AND uc2.status = 'accepted' AND uc2.connection_type = 'follower'
LEFT JOIN user_posts up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id;

-- Active gaming sessions view
CREATE VIEW active_gaming_sessions AS
SELECT 
    'destiny' as game_type,
    ds.id as session_id,
    ds.user_id,
    u.username,
    ds.started_at,
    'in_progress' as status
FROM destiny_sessions ds
JOIN users u ON ds.user_id = u.id
WHERE ds.final_outcome = 'in_progress'
UNION ALL
SELECT 
    'chess' as game_type,
    cs.id as session_id,
    cs.user_id,
    u.username,
    cs.started_at,
    'in_progress' as status
FROM chess_sessions cs
JOIN users u ON cs.user_id = u.id
WHERE cs.result = 'in_progress';

-- ============================================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================================================

DELIMITER //

-- Procedure to create a new friendship
CREATE PROCEDURE CreateFriendship(
    IN requester_user_id INT,
    IN addressee_user_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert friend request
    INSERT INTO user_connections (requester_id, addressee_id, status, connection_type)
    VALUES (requester_user_id, addressee_user_id, 'pending', 'friend');
    
    -- Create notification
    INSERT INTO user_notifications (user_id, type, title, content, related_user_id)
    VALUES (addressee_user_id, 'friend_request', 'New Friend Request', 
            CONCAT((SELECT username FROM users WHERE id = requester_user_id), ' sent you a friend request'),
            requester_user_id);
    
    COMMIT;
END //

-- Procedure to update user stats after game completion
CREATE PROCEDURE UpdateUserGameStats(
    IN user_id INT,
    IN game_type VARCHAR(20),
    IN result VARCHAR(20),
    IN points_earned INT
)
BEGIN
    -- This would update user statistics, achievements, etc.
    -- Implementation depends on specific requirements
    
    -- Example: Award achievement for first win
    IF result = 'win' THEN
        INSERT IGNORE INTO user_achievements (user_id, achievement_type, achievement_data)
        VALUES (user_id, CONCAT(game_type, '_winner'), JSON_OBJECT('first_win', NOW()));
    END IF;
END //

DELIMITER ;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

DELIMITER //

-- Update post counts when comments are added
CREATE TRIGGER update_post_comment_count
AFTER INSERT ON post_comments
FOR EACH ROW
BEGIN
    UPDATE user_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
END //

-- Update like counts when likes are added
CREATE TRIGGER update_post_like_count
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE user_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
END //

-- Update like counts when likes are removed
CREATE TRIGGER update_post_like_count_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE user_posts 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.post_id;
END //

DELIMITER ;

-- ============================================================================
-- SECURITY & CLEANUP
-- ============================================================================

-- Create cleanup events for old sessions and notifications
SET GLOBAL event_scheduler = ON;

DELIMITER //

CREATE EVENT cleanup_expired_sessions
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    DELETE FROM user_notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_read = TRUE;
END //

DELIMITER ;

-- End of Enhanced KTG Database Schema