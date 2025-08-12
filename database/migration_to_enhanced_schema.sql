-- Migration Script: Current KTG Database to Enhanced Schema
-- This script helps migrate existing data to the new enhanced database structure

-- ============================================================================
-- BACKUP EXISTING DATA FIRST!
-- ============================================================================
-- CREATE BACKUP OF EXISTING TABLES BEFORE RUNNING THIS MIGRATION
-- mysqldump -u username -p ktg_webapp > ktg_webapp_backup.sql

-- ============================================================================
-- STEP 1: CREATE NEW TABLES (Run enhanced_ktg_database_schema.sql first)
-- ============================================================================

-- ============================================================================
-- STEP 2: MIGRATE EXISTING DATA
-- ============================================================================

-- Migrate existing users (if you have users table already)
-- This assumes your current users table has basic fields
INSERT INTO users (
    email, 
    password_hash, 
    wallet_id, 
    username,
    first_name,
    last_name,
    phone,
    country_id,
    is_active,
    email_verified,
    created_at,
    updated_at,
    last_login
)
SELECT 
    email,
    password_hash,
    COALESCE(wallet_id, CONCAT('wallet_', id)) as wallet_id,
    username,
    first_name,
    last_name,
    phone,
    country_id,
    COALESCE(is_active, TRUE),
    COALESCE(email_verified, FALSE),
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW()),
    last_login
FROM users_old -- Rename your existing users table to users_old first
ON DUPLICATE KEY UPDATE
    updated_at = NOW();

-- Migrate existing avatars (if you have user_avatars table)
INSERT INTO user_avatars (
    user_id,
    avatar_name,
    avatar_data,
    avatar_image,
    is_active,
    created_at
)
SELECT 
    user_id,
    avatar_name,
    avatar_data,
    avatar_image,
    COALESCE(is_active, TRUE),
    COALESCE(created_at, NOW())
FROM user_avatars_old -- Rename existing table
ON DUPLICATE KEY UPDATE
    updated_at = NOW();

-- Migrate existing JourneyBook responses
INSERT INTO journeybook_responses (
    user_id,
    question_id,
    answer,
    created_at
)
SELECT 
    user_id,
    question_id,
    answer,
    COALESCE(created_at, NOW())
FROM journeybook_old -- Rename existing table
ON DUPLICATE KEY UPDATE
    updated_at = NOW();

-- Migrate existing user sessions
INSERT INTO user_sessions (
    user_id,
    session_token,
    expires_at,
    created_at
)
SELECT 
    user_id,
    token_hash as session_token,
    expires_at,
    COALESCE(created_at, NOW())
FROM user_sessions_old -- Rename existing table
ON DUPLICATE KEY UPDATE
    last_activity = NOW();

-- ============================================================================
-- STEP 3: CREATE SAMPLE DATA FOR NEW FEATURES
-- ============================================================================

-- Sample JourneyBook questions for the new system
INSERT INTO journeybook_questions (category_id, question_text, question_type, sort_order) VALUES
-- Personal Values category (assuming category_id = 1)
(1, 'What are your top 3 core values in life?', 'text', 1),
(1, 'How important is family to you?', 'rating', 2),
(1, 'What motivates you most in life?', 'text', 3),
(1, 'Do you believe in fate or creating your own destiny?', 'multiple_choice', 4),

-- Compatibility category (assuming category_id = 2)
(2, 'What is your ideal way to spend a weekend?', 'text', 1),
(2, 'Are you more of an introvert or extrovert?', 'multiple_choice', 2),
(2, 'How do you handle conflict in relationships?', 'text', 3),
(2, 'What is your communication style?', 'multiple_choice', 4),

-- Intimacy & Relationships category (assuming category_id = 3)
(3, 'What does intimacy mean to you?', 'text', 1),
(3, 'How important is physical affection?', 'rating', 2),
(3, 'What is your love language?', 'multiple_choice', 3),
(3, 'How do you express care for someone?', 'text', 4);

-- Sample multiple choice options for questions
UPDATE journeybook_questions 
SET options = JSON_ARRAY('Fate guides everything', 'I create my own path', 'A mix of both', 'Not sure')
WHERE question_text = 'Do you believe in fate or creating your own destiny?';

UPDATE journeybook_questions 
SET options = JSON_ARRAY('Introvert', 'Extrovert', 'Ambivert', 'Depends on situation')
WHERE question_text = 'Are you more of an introvert or extrovert?';

UPDATE journeybook_questions 
SET options = JSON_ARRAY('Direct communication', 'Avoid confrontation', 'Seek compromise', 'Take time to cool down')
WHERE question_text = 'How do you handle conflict in relationships?';

UPDATE journeybook_questions 
SET options = JSON_ARRAY('Words of Affirmation', 'Physical Touch', 'Quality Time', 'Acts of Service', 'Receiving Gifts')
WHERE question_text = 'What is your love language?';

-- ============================================================================
-- STEP 4: CREATE SAMPLE IDEAS/EXPERIENCES
-- ============================================================================

-- Sample ideas to populate the platform
INSERT INTO ideas (user_id, title, description, location, category, cost_range, cost_details, tags, group_size_min, group_size_max) VALUES
(1, 'Rooftop Sunset Yoga', 'Join us for a peaceful yoga session as the sun sets over the city skyline. Perfect for beginners and experienced practitioners alike.', 'Downtown Rooftop', 'wellness', 'low', '$15-25', JSON_ARRAY('yoga', 'sunset', 'meditation', 'wellness'), 1, 20),
(1, 'Underground Speakeasy Tour', 'Discover hidden bars and secret cocktail lounges in the city. Learn about prohibition history while enjoying craft cocktails.', 'Historic District', 'nightlife', 'medium', '$40-60', JSON_ARRAY('cocktails', 'history', 'nightlife', 'tour'), 2, 12),
(1, 'Cooking Class: Italian Cuisine', 'Learn to make authentic pasta and sauces from a professional Italian chef. Includes wine pairing and full meal.', 'Culinary Institute', 'dining', 'medium', '$75-95', JSON_ARRAY('cooking', 'italian', 'wine', 'learning'), 1, 8),
(1, 'Street Art Walking Tour', 'Explore vibrant murals and graffiti art while learning about local artists and their stories.', 'Arts District', 'culture', 'low', '$20-30', JSON_ARRAY('art', 'walking', 'culture', 'photography'), 1, 15),
(1, 'Escape Room Challenge', 'Test your problem-solving skills in themed escape rooms. Great for team building and date nights.', 'Entertainment Complex', 'entertainment', 'medium', '$30-45', JSON_ARRAY('puzzle', 'teamwork', 'challenge', 'indoor'), 2, 6);

-- ============================================================================
-- STEP 5: UPDATE EXISTING TABLES STRUCTURE (if needed)
-- ============================================================================

-- Add new columns to existing tables if they exist
-- Uncomment and modify as needed based on your current schema

-- ALTER TABLE users ADD COLUMN tagline VARCHAR(255) AFTER last_name;
-- ALTER TABLE users ADD COLUMN about_me TEXT AFTER tagline;
-- ALTER TABLE users ADD COLUMN birth_date DATE AFTER about_me;
-- ALTER TABLE users ADD COLUMN gender ENUM('male', 'female', 'other', 'prefer_not_to_say') AFTER birth_date;
-- ALTER TABLE users ADD COLUMN relationship_status ENUM('single', 'taken', 'married', 'complicated', 'open') AFTER gender;
-- ALTER TABLE users ADD COLUMN profile_visibility ENUM('public', 'friends', 'private') DEFAULT 'public' AFTER relationship_status;
-- ALTER TABLE users ADD COLUMN last_active TIMESTAMP NULL AFTER profile_visibility;

-- ============================================================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- These indexes will be created by the main schema, but if you're migrating incrementally:
-- CREATE INDEX idx_users_last_active ON users(last_active);
-- CREATE INDEX idx_ideas_category ON ideas(category);
-- CREATE INDEX idx_ideas_location ON ideas(location);

-- ============================================================================
-- STEP 7: POPULATE SYSTEM SETTINGS
-- ============================================================================

-- Update system settings with new values
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('welcome_message', 'Welcome to Karma the Game - Where Destiny Meets Community!', 'string', 'Welcome message for new users', true),
('max_file_uploads_per_user', '100', 'number', 'Maximum files a user can upload', false),
('enable_friend_requests', 'true', 'boolean', 'Allow users to send friend requests', true),
('enable_public_profiles', 'true', 'boolean', 'Allow public profile viewing', true),
('daily_token_bonus', '1', 'number', 'Daily login token bonus', true),
('referral_bonus_tokens', '5', 'number', 'Tokens awarded for successful referrals', true)
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    updated_at = NOW();

-- ============================================================================
-- STEP 8: CREATE SAMPLE ADMIN USER
-- ============================================================================

-- Create a default admin user (change password immediately!)
INSERT INTO admin_users (username, email, password_hash, role, permissions) VALUES
('admin', 'admin@karmathegame.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 
JSON_OBJECT(
    'users', JSON_ARRAY('view', 'edit', 'delete'),
    'content', JSON_ARRAY('view', 'edit', 'delete', 'moderate'),
    'system', JSON_ARRAY('view', 'edit'),
    'reports', JSON_ARRAY('view', 'export')
));

-- ============================================================================
-- STEP 9: VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the migration was successful:

-- Check user count
-- SELECT COUNT(*) as total_users FROM users;

-- Check if avatars were migrated
-- SELECT COUNT(*) as total_avatars FROM user_avatars;

-- Check JourneyBook responses
-- SELECT COUNT(*) as total_responses FROM journeybook_responses;

-- Check system settings
-- SELECT COUNT(*) as total_settings FROM system_settings;

-- Check sample ideas
-- SELECT COUNT(*) as total_ideas FROM ideas;

-- ============================================================================
-- STEP 10: CLEANUP OLD TABLES (ONLY AFTER VERIFICATION)
-- ============================================================================

-- IMPORTANT: Only run these after verifying all data migrated correctly!
-- Keep backups of old tables for at least 30 days

-- DROP TABLE IF EXISTS users_old;
-- DROP TABLE IF EXISTS user_avatars_old;
-- DROP TABLE IF EXISTS journeybook_old;
-- DROP TABLE IF EXISTS user_sessions_old;

-- ============================================================================
-- POST-MIGRATION TASKS
-- ============================================================================

-- 1. Update your application configuration to use new table structures
-- 2. Update API endpoints to handle new fields
-- 3. Test all functionality thoroughly
-- 4. Update frontend to display new features
-- 5. Create user documentation for new features
-- 6. Set up monitoring for new tables and features

-- ============================================================================
-- ROLLBACK PLAN (if needed)
-- ============================================================================

-- If you need to rollback:
-- 1. Restore from backup: mysql -u username -p ktg_webapp < ktg_webapp_backup.sql
-- 2. Update application configuration back to old schema
-- 3. Test thoroughly

-- Migration completed successfully!
-- Remember to update your application code to work with the new schema.