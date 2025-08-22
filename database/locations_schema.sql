-- Locations Database Schema
-- For managing geographic locations used in listings and avatar preferences

-- ============================================================================
-- LOCATIONS TABLE
-- ============================================================================

CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    continent VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    population INT,
    is_major_city BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_locations_country (country),
    INDEX idx_locations_city (city),
    INDEX idx_locations_major (is_major_city),
    UNIQUE KEY unique_city_country (city, country)
);

-- ============================================================================
-- DOOR CATEGORIES TABLE
-- ============================================================================

CREATE TABLE door_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INITIAL DATA - MAJOR CITIES
-- ============================================================================

INSERT INTO locations (city, state, country, country_code, continent, latitude, longitude, timezone, population, is_major_city) VALUES
-- North America - United States
('New York', 'New York', 'United States', 'USA', 'North America', 40.7128, -74.0060, 'America/New_York', 8336817, TRUE),
('Los Angeles', 'California', 'United States', 'USA', 'North America', 34.0522, -118.2437, 'America/Los_Angeles', 3979576, TRUE),
('Chicago', 'Illinois', 'United States', 'USA', 'North America', 41.8781, -87.6298, 'America/Chicago', 2693976, TRUE),
('Houston', 'Texas', 'United States', 'USA', 'North America', 29.7604, -95.3698, 'America/Chicago', 2320268, TRUE),
('Phoenix', 'Arizona', 'United States', 'USA', 'North America', 33.4484, -112.0740, 'America/Phoenix', 1680992, TRUE),
('Philadelphia', 'Pennsylvania', 'United States', 'USA', 'North America', 39.9526, -75.1652, 'America/New_York', 1584064, TRUE),
('San Antonio', 'Texas', 'United States', 'USA', 'North America', 29.4241, -98.4936, 'America/Chicago', 1547253, TRUE),
('San Diego', 'California', 'United States', 'USA', 'North America', 32.7157, -117.1611, 'America/Los_Angeles', 1423851, TRUE),
('Dallas', 'Texas', 'United States', 'USA', 'North America', 32.7767, -96.7970, 'America/Chicago', 1343573, TRUE),
('San Jose', 'California', 'United States', 'USA', 'North America', 37.3382, -121.8863, 'America/Los_Angeles', 1021795, TRUE),
('Austin', 'Texas', 'United States', 'USA', 'North America', 30.2672, -97.7431, 'America/Chicago', 978908, TRUE),
('Jacksonville', 'Florida', 'United States', 'USA', 'North America', 30.3322, -81.6557, 'America/New_York', 949611, TRUE),
('San Francisco', 'California', 'United States', 'USA', 'North America', 37.7749, -122.4194, 'America/Los_Angeles', 881549, TRUE),
('Columbus', 'Ohio', 'United States', 'USA', 'North America', 39.9612, -82.9988, 'America/New_York', 898553, TRUE),
('Fort Worth', 'Texas', 'United States', 'USA', 'North America', 32.7555, -97.3308, 'America/Chicago', 918915, TRUE),
('Indianapolis', 'Indiana', 'United States', 'USA', 'North America', 39.7684, -86.1581, 'America/Indiana/Indianapolis', 887642, TRUE),
('Charlotte', 'North Carolina', 'United States', 'USA', 'North America', 35.2271, -80.8431, 'America/New_York', 885708, TRUE),
('Seattle', 'Washington', 'United States', 'USA', 'North America', 47.6062, -122.3321, 'America/Los_Angeles', 753675, TRUE),
('Denver', 'Colorado', 'United States', 'USA', 'North America', 39.7392, -104.9903, 'America/Denver', 715522, TRUE),
('Washington', 'District of Columbia', 'United States', 'USA', 'North America', 38.9072, -77.0369, 'America/New_York', 689545, TRUE),

-- North America - Canada
('Toronto', 'Ontario', 'Canada', 'CAN', 'North America', 43.6532, -79.3832, 'America/Toronto', 2930000, TRUE),
('Montreal', 'Quebec', 'Canada', 'CAN', 'North America', 45.5017, -73.5673, 'America/Toronto', 1780000, TRUE),
('Vancouver', 'British Columbia', 'Canada', 'CAN', 'North America', 49.2827, -123.1207, 'America/Vancouver', 675218, TRUE),
('Calgary', 'Alberta', 'Canada', 'CAN', 'North America', 51.0447, -114.0719, 'America/Edmonton', 1336000, TRUE),
('Edmonton', 'Alberta', 'Canada', 'CAN', 'North America', 53.5461, -113.4938, 'America/Edmonton', 981280, TRUE),
('Ottawa', 'Ontario', 'Canada', 'CAN', 'North America', 45.4215, -75.6972, 'America/Toronto', 994837, TRUE),

-- North America - Mexico
('Mexico City', 'Mexico City', 'Mexico', 'MEX', 'North America', 19.4326, -99.1332, 'America/Mexico_City', 9209944, TRUE),
('Guadalajara', 'Jalisco', 'Mexico', 'MEX', 'North America', 20.6597, -103.3496, 'America/Mexico_City', 1385629, TRUE),
('Monterrey', 'Nuevo León', 'Mexico', 'MEX', 'North America', 25.6866, -100.3161, 'America/Monterrey', 1135512, TRUE),

-- Europe
('London', NULL, 'United Kingdom', 'GBR', 'Europe', 51.5074, -0.1278, 'Europe/London', 9648110, TRUE),
('Berlin', NULL, 'Germany', 'DEU', 'Europe', 52.5200, 13.4050, 'Europe/Berlin', 3669491, TRUE),
('Madrid', NULL, 'Spain', 'ESP', 'Europe', 40.4168, -3.7038, 'Europe/Madrid', 3223334, TRUE),
('Rome', NULL, 'Italy', 'ITA', 'Europe', 41.9028, 12.4964, 'Europe/Rome', 2872800, TRUE),
('Paris', NULL, 'France', 'FRA', 'Europe', 48.8566, 2.3522, 'Europe/Paris', 2165423, TRUE),
('Hamburg', NULL, 'Germany', 'DEU', 'Europe', 53.5511, 9.9937, 'Europe/Berlin', 1899160, TRUE),
('Budapest', NULL, 'Hungary', 'HUN', 'Europe', 47.4979, 19.0402, 'Europe/Budapest', 1752286, TRUE),
('Warsaw', NULL, 'Poland', 'POL', 'Europe', 52.2297, 21.0122, 'Europe/Warsaw', 1790658, TRUE),
('Vienna', NULL, 'Austria', 'AUT', 'Europe', 48.2082, 16.3738, 'Europe/Vienna', 1911191, TRUE),
('Barcelona', NULL, 'Spain', 'ESP', 'Europe', 41.3851, 2.1734, 'Europe/Madrid', 1620343, TRUE),
('Munich', NULL, 'Germany', 'DEU', 'Europe', 48.1351, 11.5820, 'Europe/Berlin', 1471508, TRUE),
('Milan', NULL, 'Italy', 'ITA', 'Europe', 45.4642, 9.1900, 'Europe/Rome', 1396059, TRUE),
('Prague', NULL, 'Czech Republic', 'CZE', 'Europe', 50.0755, 14.4378, 'Europe/Prague', 1318982, TRUE),
('Sofia', NULL, 'Bulgaria', 'BGR', 'Europe', 42.6977, 23.3219, 'Europe/Sofia', 1400384, TRUE),
('Brussels', NULL, 'Belgium', 'BEL', 'Europe', 50.8503, 4.3517, 'Europe/Brussels', 1208542, TRUE),
('Amsterdam', NULL, 'Netherlands', 'NLD', 'Europe', 52.3676, 4.9041, 'Europe/Amsterdam', 873555, TRUE),
('Stockholm', NULL, 'Sweden', 'SWE', 'Europe', 59.3293, 18.0686, 'Europe/Stockholm', 975551, TRUE),
('Copenhagen', NULL, 'Denmark', 'DNK', 'Europe', 55.6761, 12.5683, 'Europe/Copenhagen', 656787, TRUE),
('Helsinki', NULL, 'Finland', 'FIN', 'Europe', 60.1699, 24.9384, 'Europe/Helsinki', 658864, TRUE),
('Oslo', NULL, 'Norway', 'NOR', 'Europe', 59.9139, 10.7522, 'Europe/Oslo', 697549, TRUE),

-- Asia
('Tokyo', NULL, 'Japan', 'JPN', 'Asia', 35.6762, 139.6503, 'Asia/Tokyo', 37435191, TRUE),
('Delhi', NULL, 'India', 'IND', 'Asia', 28.7041, 77.1025, 'Asia/Kolkata', 32941308, TRUE),
('Shanghai', NULL, 'China', 'CHN', 'Asia', 31.2304, 121.4737, 'Asia/Shanghai', 28516904, TRUE),
('Dhaka', NULL, 'Bangladesh', 'BGD', 'Asia', 23.8103, 90.4125, 'Asia/Dhaka', 22478116, TRUE),
('São Paulo', NULL, 'Brazil', 'BRA', 'South America', -23.5558, -46.6396, 'America/Sao_Paulo', 22620000, TRUE),
('Cairo', NULL, 'Egypt', 'EGY', 'Africa', 30.0444, 31.2357, 'Africa/Cairo', 21322750, TRUE),
('Mexico City', NULL, 'Mexico', 'MEX', 'North America', 19.4326, -99.1332, 'America/Mexico_City', 21804515, TRUE),
('Beijing', NULL, 'China', 'CHN', 'Asia', 39.9042, 116.4074, 'Asia/Shanghai', 21893095, TRUE),
('Mumbai', NULL, 'India', 'IND', 'Asia', 19.0760, 72.8777, 'Asia/Kolkata', 20961472, TRUE),
('Osaka', NULL, 'Japan', 'JPN', 'Asia', 34.6937, 135.5023, 'Asia/Tokyo', 18967459, TRUE),
('Karachi', NULL, 'Pakistan', 'PAK', 'Asia', 24.8607, 67.0011, 'Asia/Karachi', 16459472, TRUE),
('Chongqing', NULL, 'China', 'CHN', 'Asia', 29.4316, 106.9123, 'Asia/Shanghai', 16382376, TRUE),
('Istanbul', NULL, 'Turkey', 'TUR', 'Europe', 41.0082, 28.9784, 'Europe/Istanbul', 15636243, TRUE),
('Buenos Aires', NULL, 'Argentina', 'ARG', 'South America', -34.6118, -58.3960, 'America/Argentina/Buenos_Aires', 15594428, TRUE),
('Kolkata', NULL, 'India', 'IND', 'Asia', 22.5726, 88.3639, 'Asia/Kolkata', 15133888, TRUE),
('Lagos', NULL, 'Nigeria', 'NGA', 'Africa', 6.5244, 3.3792, 'Africa/Lagos', 15388000, TRUE),
('Manila', NULL, 'Philippines', 'PHL', 'Asia', 14.5995, 120.9842, 'Asia/Manila', 14158573, TRUE),
('Tianjin', NULL, 'China', 'CHN', 'Asia', 39.3434, 117.3616, 'Asia/Shanghai', 13866009, TRUE),
('Guangzhou', NULL, 'China', 'CHN', 'Asia', 23.1291, 113.2644, 'Asia/Shanghai', 13635397, TRUE),
('Rio de Janeiro', NULL, 'Brazil', 'BRA', 'South America', -22.9068, -43.1729, 'America/Sao_Paulo', 13458075, TRUE),

-- Australia & Oceania
('Sydney', 'New South Wales', 'Australia', 'AUS', 'Oceania', -33.8688, 151.2093, 'Australia/Sydney', 5312163, TRUE),
('Melbourne', 'Victoria', 'Australia', 'AUS', 'Oceania', -37.8136, 144.9631, 'Australia/Melbourne', 5078193, TRUE),
('Brisbane', 'Queensland', 'Australia', 'AUS', 'Oceania', -27.4698, 153.0251, 'Australia/Brisbane', 2560720, TRUE),
('Perth', 'Western Australia', 'Australia', 'AUS', 'Oceania', -31.9505, 115.8605, 'Australia/Perth', 2192229, TRUE),
('Adelaide', 'South Australia', 'Australia', 'AUS', 'Oceania', -34.9285, 138.6007, 'Australia/Adelaide', 1402393, TRUE),
('Auckland', NULL, 'New Zealand', 'NZL', 'Oceania', -36.8485, 174.7633, 'Pacific/Auckland', 1695200, TRUE),

-- Africa
('Lagos', NULL, 'Nigeria', 'NGA', 'Africa', 6.5244, 3.3792, 'Africa/Lagos', 15388000, TRUE),
('Cairo', NULL, 'Egypt', 'EGY', 'Africa', 30.0444, 31.2357, 'Africa/Cairo', 21322750, TRUE),
('Kinshasa', NULL, 'Democratic Republic of Congo', 'COD', 'Africa', -4.4419, 15.2663, 'Africa/Kinshasa', 17071000, TRUE),
('Johannesburg', NULL, 'South Africa', 'ZAF', 'Africa', -26.2041, 28.0473, 'Africa/Johannesburg', 5635127, TRUE),
('Luanda', NULL, 'Angola', 'AGO', 'Africa', -8.8390, 13.2894, 'Africa/Luanda', 8952496, TRUE),
('Dar es Salaam', NULL, 'Tanzania', 'TZA', 'Africa', -6.7924, 39.2083, 'Africa/Dar_es_Salaam', 7404689, TRUE),
('Khartoum', NULL, 'Sudan', 'SDN', 'Africa', 15.5007, 32.5599, 'Africa/Khartoum', 6344348, TRUE),
('Abidjan', NULL, 'Ivory Coast', 'CIV', 'Africa', 5.3600, -4.0083, 'Africa/Abidjan', 6321017, TRUE),
('Alexandria', NULL, 'Egypt', 'EGY', 'Africa', 31.2001, 29.9187, 'Africa/Cairo', 5381000, TRUE),
('Nairobi', NULL, 'Kenya', 'KEN', 'Africa', -1.2921, 36.8219, 'Africa/Nairobi', 5325000, TRUE),

-- South America
('São Paulo', NULL, 'Brazil', 'BRA', 'South America', -23.5558, -46.6396, 'America/Sao_Paulo', 22620000, TRUE),
('Buenos Aires', NULL, 'Argentina', 'ARG', 'South America', -34.6118, -58.3960, 'America/Argentina/Buenos_Aires', 15594428, TRUE),
('Rio de Janeiro', NULL, 'Brazil', 'BRA', 'South America', -22.9068, -43.1729, 'America/Sao_Paulo', 13458075, TRUE),
('Lima', NULL, 'Peru', 'PER', 'South America', -12.0464, -77.0428, 'America/Lima', 10719188, TRUE),
('Bogotá', NULL, 'Colombia', 'COL', 'South America', 4.7110, -74.0721, 'America/Bogota', 10574000, TRUE),
('Santiago', NULL, 'Chile', 'CHL', 'South America', -33.4489, -70.6693, 'America/Santiago', 7026000, TRUE),
('Belo Horizonte', NULL, 'Brazil', 'BRA', 'South America', -19.9167, -43.9345, 'America/Sao_Paulo', 6145800, TRUE),
('Caracas', NULL, 'Venezuela', 'VEN', 'South America', 10.4806, -66.9036, 'America/Caracas', 2935744, TRUE),
('Salvador', NULL, 'Brazil', 'BRA', 'South America', -12.9714, -38.5014, 'America/Bahia', 2886698, TRUE),
('Brasília', NULL, 'Brazil', 'BRA', 'South America', -15.8267, -47.9218, 'America/Sao_Paulo', 3094325, TRUE);

-- ============================================================================
-- DOOR CATEGORIES DATA
-- ============================================================================

INSERT INTO door_categories (name, color, description, sort_order) VALUES
('Blue', 'Blue', 'Values - Core beliefs, personality traits, and fundamental life perspectives', 1),
('Yellow', 'Yellow', 'Compatibility - Interests, hobbies, activities, and lifestyle preferences', 2),
('Red', 'Red', 'Intimacy - Personal preferences and relationship dynamics for deeper connections', 3);

-- ============================================================================
-- UPDATE AVATAR_ANSWERS TABLE TO INCLUDE LOCATION
-- ============================================================================

-- Add location_id to avatar_answers table
ALTER TABLE avatar_answers 
ADD COLUMN location_id INT,
ADD FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;

-- ============================================================================
-- UPDATE LIFESTYLE_LISTINGS TABLE TO USE LOCATION_ID
-- ============================================================================

-- Add location_id to lifestyle_listings table
ALTER TABLE lifestyle_listings 
ADD COLUMN location_id INT,
ADD FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
ADD COLUMN door_category_id INT,
ADD FOREIGN KEY (door_category_id) REFERENCES door_categories(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX idx_lifestyle_listings_location ON lifestyle_listings(location_id);
CREATE INDEX idx_lifestyle_listings_door ON lifestyle_listings(door_category_id);
CREATE INDEX idx_avatar_answers_location ON avatar_answers(location_id);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for listings with location and door category info
CREATE VIEW listings_with_location AS
SELECT 
    ll.*,
    l.city,
    l.state,
    l.country,
    l.country_code,
    dc.name as door_category,
    dc.color as door_color
FROM lifestyle_listings ll
LEFT JOIN locations l ON ll.location_id = l.id
LEFT JOIN door_categories dc ON ll.door_category_id = dc.id;

-- View for avatar answers with location info
CREATE VIEW avatar_answers_with_location AS
SELECT 
    aa.*,
    l.city,
    l.state,
    l.country,
    l.country_code
FROM avatar_answers aa
LEFT JOIN locations l ON aa.location_id = l.id;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure to get listings by location and door category
CREATE PROCEDURE GetListingsByLocationAndDoor(
    IN p_location_id INT,
    IN p_door_category_id INT,
    IN p_limit INT DEFAULT 50
)
BEGIN
    SELECT 
        ll.*,
        l.city,
        l.country,
        dc.name as door_category,
        dc.color as door_color,
        ucp.creator_name,
        ucp.profile_image as creator_image
    FROM lifestyle_listings ll
    LEFT JOIN locations l ON ll.location_id = l.id
    LEFT JOIN door_categories dc ON ll.door_category_id = dc.id
    LEFT JOIN user_creator_profiles ucp ON ll.creator_id = ucp.id
    WHERE (p_location_id IS NULL OR ll.location_id = p_location_id)
    AND (p_door_category_id IS NULL OR ll.door_category_id = p_door_category_id)
    AND ll.status = 'published'
    ORDER BY ll.created_at DESC
    LIMIT p_limit;
END //

-- Procedure to search locations by name
CREATE PROCEDURE SearchLocations(
    IN p_search_term VARCHAR(100),
    IN p_limit INT DEFAULT 20
)
BEGIN
    SELECT 
        id,
        city,
        state,
        country,
        country_code,
        CONCAT(city, 
               CASE WHEN state IS NOT NULL THEN CONCAT(', ', state) ELSE '' END,
               ', ', country) as full_name
    FROM locations
    WHERE (city LIKE CONCAT('%', p_search_term, '%')
           OR country LIKE CONCAT('%', p_search_term, '%')
           OR (state IS NOT NULL AND state LIKE CONCAT('%', p_search_term, '%')))
    AND is_active = TRUE
    ORDER BY 
        CASE WHEN is_major_city THEN 0 ELSE 1 END,
        population DESC,
        city ASC
    LIMIT p_limit;
END //

DELIMITER ;