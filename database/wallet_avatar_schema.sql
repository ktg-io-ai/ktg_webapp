-- Wallet and Avatar Tables for KTG Platform

-- Wallets table - one per user account
CREATE TABLE wallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    wallet_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Avatars table - multiple avatars per wallet
CREATE TABLE avatars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wallet_id VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    generation_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id) ON DELETE CASCADE
);

-- Update user_tokens to reference wallet_id instead of user_id
ALTER TABLE user_tokens 
ADD COLUMN wallet_id VARCHAR(255),
ADD FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id) ON DELETE CASCADE;