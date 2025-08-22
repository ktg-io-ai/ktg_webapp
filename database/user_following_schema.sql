-- User following system for creator sponsorship

-- Add following_creator_id to users table
ALTER TABLE users 
ADD COLUMN following_creator_id INT NULL,
ADD FOREIGN KEY (following_creator_id) REFERENCES user_creator_profiles(id);

-- Create user_creator_followers table for tracking followers
CREATE TABLE user_creator_followers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    creator_id INT NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_sponsor BOOLEAN DEFAULT FALSE,
    sponsor_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_creator (user_id, creator_id)
);

-- Create listing interactions table
CREATE TABLE listing_interactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    user_id INT NOT NULL,
    interaction_type ENUM('view', 'bucketlist', 'share', 'hide', 'zap', 'outing') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_listing_type (user_id, listing_id, interaction_type)
);