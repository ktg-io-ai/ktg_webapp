-- JourneyBook Images Table
CREATE TABLE journeybook_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    avatar_id INT NOT NULL,
    page_number INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    prompt_used TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE,
    UNIQUE KEY unique_avatar_page (avatar_id, page_number)
);