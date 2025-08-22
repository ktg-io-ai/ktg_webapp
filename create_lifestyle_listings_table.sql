-- Create lifestyle_listings table for creator dashboard
CREATE TABLE IF NOT EXISTS lifestyle_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    description TEXT,
    brief_description TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    price_range ENUM('free', 'low', 'medium', 'high', 'luxury') DEFAULT 'medium',
    door_category_id INT,
    featured_image VARCHAR(500),
    image_gallery TEXT,
    status ENUM('draft', 'pending', 'published', 'featured') DEFAULT 'published',
    views_count INT DEFAULT 0,
    bucketlist_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    zaps_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);