-- JourneyBook Pages Table for storing question templates
CREATE TABLE journeybook_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    subgroup VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    options JSON,
    image_url VARCHAR(500),
    page_number VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_section_subgroup (section, subgroup),
    INDEX idx_page_number (page_number)
);