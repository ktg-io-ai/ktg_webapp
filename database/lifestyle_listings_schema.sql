-- Lifestyle Listings Database Schema
-- For creators/influencers to post lifestyle listings and experiences

-- ============================================================================
-- CREATOR ROLES & PERMISSIONS
-- ============================================================================

-- Creator roles table (11 roles from influencer landing page)
CREATE TABLE creator_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    role_description TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage commission
    min_followers INT DEFAULT 0,
    max_posts_per_month INT DEFAULT 10,
    can_feature_listings BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User creator profiles (extends users table)
CREATE TABLE user_creator_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    creator_role_id INT NOT NULL,
    creator_name VARCHAR(100),
    creator_tagline VARCHAR(255),
    bio TEXT,
    profile_image VARCHAR(255),
    cover_image VARCHAR(255),
    social_links JSON, -- Instagram, TikTok, YouTube, etc.
    follower_count INT DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    specialties JSON, -- Array of specialties/niches
    location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    approval_status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    approved_by INT, -- Admin user ID
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_role_id) REFERENCES creator_roles(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_creator (user_id)
);

-- ============================================================================
-- LIFESTYLE LISTINGS SYSTEM
-- ============================================================================

-- Listing categories
CREATE TABLE listing_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#000000',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_category_id) REFERENCES listing_categories(id)
);

-- Main lifestyle listings table
CREATE TABLE lifestyle_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    brief_description TEXT,
    category_id INT,
    subcategory_id INT,
    
    -- Location details
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    full_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Media
    featured_image VARCHAR(255),
    image_gallery JSON, -- Array of image URLs
    video_url VARCHAR(500),
    
    -- Pricing & Details
    price_range ENUM('free', 'low', 'medium', 'high', 'luxury') DEFAULT 'medium',
    price_details VARCHAR(255),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Event/Experience details
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    duration_minutes INT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(100), -- daily, weekly, monthly, etc.
    
    -- Capacity & Requirements
    min_participants INT DEFAULT 1,
    max_participants INT DEFAULT 100,
    age_restriction INT DEFAULT 0,
    requirements TEXT,
    what_to_bring TEXT,
    
    -- Contact & Booking
    contact_method ENUM('email', 'phone', 'website', 'app') DEFAULT 'email',
    contact_details VARCHAR(255),
    booking_url VARCHAR(500),
    external_link VARCHAR(500),
    
    -- Status & Moderation
    status ENUM('draft', 'pending', 'published', 'featured', 'archived', 'rejected') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP NULL,
    moderation_notes TEXT,
    moderated_by INT,
    moderated_at TIMESTAMP NULL,
    
    -- Engagement metrics
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    bookings_count INT DEFAULT 0,
    
    -- SEO & Tags
    tags JSON, -- Array of tags
    seo_title VARCHAR(255),
    seo_description TEXT,
    slug VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    
    FOREIGN KEY (creator_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES listing_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES listing_categories(id),
    FOREIGN KEY (moderated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    
    INDEX idx_listings_creator (creator_id),
    INDEX idx_listings_category (category_id),
    INDEX idx_listings_location (city, state, country),
    INDEX idx_listings_status (status),
    INDEX idx_listings_featured (is_featured),
    INDEX idx_listings_dates (start_date, end_date),
    INDEX idx_listings_price (min_price, max_price),
    UNIQUE KEY unique_slug (slug)
);

-- ============================================================================
-- USER INTERACTIONS WITH LISTINGS
-- ============================================================================

-- User saves/bookmarks
CREATE TABLE listing_saves (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_save (user_id, listing_id)
);

-- User likes/reactions
CREATE TABLE listing_reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    reaction_type ENUM('like', 'love', 'wow', 'interested', 'going') DEFAULT 'like',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reaction (user_id, listing_id)
);

-- User reviews and ratings
CREATE TABLE listing_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    pros TEXT,
    cons TEXT,
    would_recommend BOOLEAN,
    visited_date DATE,
    is_verified BOOLEAN DEFAULT FALSE, -- Verified attendance
    helpful_votes INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
    moderated_by INT,
    moderated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_review (user_id, listing_id)
);

-- Review helpfulness votes
CREATE TABLE review_votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    review_id INT NOT NULL,
    vote_type ENUM('helpful', 'not_helpful') DEFAULT 'helpful',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES listing_reviews(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vote (user_id, review_id)
);

-- ============================================================================
-- BOOKING & ATTENDANCE SYSTEM
-- ============================================================================

-- Listing bookings/RSVPs
CREATE TABLE listing_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    booking_reference VARCHAR(50) UNIQUE,
    party_size INT DEFAULT 1,
    booking_date DATE,
    booking_time TIME,
    special_requests TEXT,
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    payment_status ENUM('none', 'pending', 'paid', 'refunded') DEFAULT 'none',
    payment_amount DECIMAL(10,2),
    payment_reference VARCHAR(100),
    confirmation_sent BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    attended BOOLEAN DEFAULT FALSE,
    creator_notes TEXT,
    user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE CASCADE,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_listing (listing_id),
    INDEX idx_bookings_date (booking_date),
    INDEX idx_bookings_status (status)
);

-- ============================================================================
-- CREATOR EARNINGS & ANALYTICS
-- ============================================================================

-- Creator earnings tracking
CREATE TABLE creator_earnings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    listing_id INT,
    earning_type ENUM('listing_view', 'listing_booking', 'referral_commission', 'featured_listing', 'subscription') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    commission_rate DECIMAL(5,2),
    reference_id VARCHAR(100), -- Booking ID, payment reference, etc.
    description TEXT,
    status ENUM('pending', 'confirmed', 'paid', 'disputed') DEFAULT 'pending',
    payout_batch_id VARCHAR(100),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (creator_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES lifestyle_listings(id) ON DELETE SET NULL,
    INDEX idx_earnings_creator (creator_id),
    INDEX idx_earnings_type (earning_type),
    INDEX idx_earnings_status (status),
    INDEX idx_earnings_date (earned_at)
);

-- Creator analytics (daily aggregates)
CREATE TABLE creator_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    date DATE NOT NULL,
    listings_views INT DEFAULT 0,
    listings_likes INT DEFAULT 0,
    listings_saves INT DEFAULT 0,
    listings_shares INT DEFAULT 0,
    bookings_received INT DEFAULT 0,
    bookings_confirmed INT DEFAULT 0,
    revenue_earned DECIMAL(10,2) DEFAULT 0.00,
    new_followers INT DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_creator_date (creator_id, date)
);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert creator roles (11 roles from influencer landing page)
INSERT INTO creator_roles (role_name, role_description, commission_rate, min_followers, max_posts_per_month, can_feature_listings, sort_order) VALUES
('Nano Influencer', 'Creators with 1K-10K followers, high engagement rates', 15.00, 1000, 5, FALSE, 1),
('Micro Influencer', 'Creators with 10K-100K followers, niche expertise', 12.00, 10000, 8, FALSE, 2),
('Mid-Tier Influencer', 'Creators with 100K-500K followers, established presence', 10.00, 100000, 12, TRUE, 3),
('Macro Influencer', 'Creators with 500K-1M followers, broad reach', 8.00, 500000, 15, TRUE, 4),
('Mega Influencer', 'Creators with 1M+ followers, celebrity status', 6.00, 1000000, 20, TRUE, 5),
('Content Creator', 'Professional content creators, any follower count', 10.00, 0, 10, FALSE, 6),
('Local Expert', 'Local area specialists and community leaders', 12.00, 500, 8, FALSE, 7),
('Event Organizer', 'Professional event planners and organizers', 15.00, 0, 15, TRUE, 8),
('Lifestyle Blogger', 'Lifestyle and travel content specialists', 10.00, 5000, 10, FALSE, 9),
('Brand Ambassador', 'Official brand representatives and partners', 8.00, 10000, 12, TRUE, 10),
('VIP Creator', 'Exclusive high-tier creators with special privileges', 5.00, 100000, 25, TRUE, 11);

-- Insert listing categories
INSERT INTO listing_categories (name, description, icon, color, sort_order) VALUES
('Entertainment', 'Movies, shows, concerts, performances', 'entertainment', '#FF6B6B', 1),
('Dining & Food', 'Restaurants, cafes, food experiences', 'dining', '#4ECDC4', 2),
('Adventure & Sports', 'Outdoor activities, sports, adventures', 'adventure', '#45B7D1', 3),
('Culture & Arts', 'Museums, galleries, cultural events', 'culture', '#96CEB4', 4),
('Nightlife & Bars', 'Bars, clubs, nightlife venues', 'nightlife', '#FFEAA7', 5),
('Wellness & Spa', 'Spas, wellness centers, health activities', 'wellness', '#DDA0DD', 6),
('Education & Workshops', 'Classes, workshops, learning experiences', 'education', '#98D8C8', 7),
('Shopping & Retail', 'Shopping experiences, markets, boutiques', 'shopping', '#F7DC6F', 8),
('Travel & Tourism', 'Tours, travel experiences, sightseeing', 'travel', '#BB8FCE', 9),
('Social & Networking', 'Meetups, networking events, social gatherings', 'social', '#85C1E9', 10);

-- Insert subcategories for Entertainment
INSERT INTO listing_categories (name, parent_category_id, description, sort_order) VALUES
('Live Music', 1, 'Concerts, live performances, music venues', 1),
('Theater & Shows', 1, 'Theater performances, comedy shows, live entertainment', 2),
('Movies & Cinema', 1, 'Movie theaters, film screenings, cinema experiences', 3),
('Festivals & Events', 1, 'Music festivals, cultural events, celebrations', 4);

-- Insert subcategories for Dining & Food
INSERT INTO listing_categories (name, parent_category_id, description, sort_order) VALUES
('Fine Dining', 2, 'Upscale restaurants, gourmet experiences', 1),
('Casual Dining', 2, 'Casual restaurants, family dining', 2),
('Cafes & Coffee', 2, 'Coffee shops, cafes, casual meeting spots', 3),
('Food Tours', 2, 'Culinary tours, food experiences', 4),
('Bars & Pubs', 2, 'Drinking establishments, pub experiences', 5);

-- Create indexes for performance
CREATE INDEX idx_creator_profiles_role ON user_creator_profiles(creator_role_id);
CREATE INDEX idx_creator_profiles_status ON user_creator_profiles(approval_status);
CREATE INDEX idx_creator_profiles_location ON user_creator_profiles(location);
CREATE INDEX idx_listings_published ON lifestyle_listings(published_at);
CREATE INDEX idx_listings_views ON lifestyle_listings(views_count);
CREATE INDEX idx_bookings_reference ON listing_bookings(booking_reference);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active listings with creator info
CREATE VIEW active_listings_with_creators AS
SELECT 
    ll.*,
    ucp.creator_name,
    ucp.creator_tagline,
    ucp.profile_image as creator_image,
    ucp.follower_count,
    cr.role_name as creator_role,
    cr.commission_rate,
    lc.name as category_name,
    lc.color as category_color
FROM lifestyle_listings ll
JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
JOIN creator_roles cr ON ucp.creator_role_id = cr.id
LEFT JOIN listing_categories lc ON ll.category_id = lc.id
WHERE ll.status = 'published' 
AND ucp.is_active = TRUE 
AND ucp.approval_status = 'approved';

-- Creator performance summary
CREATE VIEW creator_performance_summary AS
SELECT 
    ucp.id as creator_id,
    ucp.creator_name,
    cr.role_name,
    COUNT(ll.id) as total_listings,
    COUNT(CASE WHEN ll.status = 'published' THEN 1 END) as published_listings,
    SUM(ll.views_count) as total_views,
    SUM(ll.likes_count) as total_likes,
    SUM(ll.bookings_count) as total_bookings,
    COALESCE(SUM(ce.amount), 0) as total_earnings,
    AVG(lr.rating) as average_rating,
    COUNT(lr.id) as total_reviews
FROM user_creator_profiles ucp
JOIN creator_roles cr ON ucp.creator_role_id = cr.id
LEFT JOIN lifestyle_listings ll ON ucp.id = ll.creator_id
LEFT JOIN creator_earnings ce ON ucp.id = ce.creator_id AND ce.status = 'confirmed'
LEFT JOIN listing_reviews lr ON ll.id = lr.listing_id AND lr.status = 'approved'
WHERE ucp.is_active = TRUE
GROUP BY ucp.id, ucp.creator_name, cr.role_name;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure to update listing engagement metrics
CREATE PROCEDURE UpdateListingEngagement(
    IN listing_id INT,
    IN engagement_type VARCHAR(20),
    IN increment_value INT DEFAULT 1
)
BEGIN
    CASE engagement_type
        WHEN 'view' THEN
            UPDATE lifestyle_listings SET views_count = views_count + increment_value WHERE id = listing_id;
        WHEN 'like' THEN
            UPDATE lifestyle_listings SET likes_count = likes_count + increment_value WHERE id = listing_id;
        WHEN 'save' THEN
            UPDATE lifestyle_listings SET saves_count = saves_count + increment_value WHERE id = listing_id;
        WHEN 'share' THEN
            UPDATE lifestyle_listings SET shares_count = shares_count + increment_value WHERE id = listing_id;
        WHEN 'booking' THEN
            UPDATE lifestyle_listings SET bookings_count = bookings_count + increment_value WHERE id = listing_id;
    END CASE;
END //

-- Procedure to calculate creator earnings
CREATE PROCEDURE CalculateCreatorEarnings(
    IN creator_id INT,
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        earning_type,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
    FROM creator_earnings 
    WHERE creator_id = creator_id 
    AND DATE(earned_at) BETWEEN start_date AND end_date
    AND status IN ('confirmed', 'paid')
    GROUP BY earning_type
    ORDER BY total_amount DESC;
END //

DELIMITER ;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DELIMITER //

-- Update creator earnings when booking is confirmed
CREATE TRIGGER update_creator_earnings_on_booking
AFTER UPDATE ON listing_bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        INSERT INTO creator_earnings (
            creator_id, 
            listing_id, 
            earning_type, 
            amount, 
            commission_rate, 
            reference_id, 
            description
        )
        SELECT 
            ll.creator_id,
            ll.id,
            'listing_booking',
            COALESCE(NEW.payment_amount * (cr.commission_rate / 100), 5.00), -- Default $5 if no payment
            cr.commission_rate,
            NEW.booking_reference,
            CONCAT('Booking commission for: ', ll.title)
        FROM lifestyle_listings ll
        JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
        JOIN creator_roles cr ON ucp.creator_role_id = cr.id
        WHERE ll.id = NEW.listing_id;
    END IF;
END //

-- Update review helpfulness count
CREATE TRIGGER update_review_helpful_votes
AFTER INSERT ON review_votes
FOR EACH ROW
BEGIN
    IF NEW.vote_type = 'helpful' THEN
        UPDATE listing_reviews 
        SET helpful_votes = helpful_votes + 1 
        WHERE id = NEW.review_id;
    END IF;
END //

DELIMITER ;

-- End of Lifestyle Listings Schema