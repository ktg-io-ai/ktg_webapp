-- Add wallet tables to existing database
-- Run this to add wallet functionality to your current ktg_webapp database

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    wallet_id VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wallets_user_id (user_id),
    INDEX idx_wallets_wallet_id (wallet_id)
);

-- Create wallet_tokens table (from your wallet schema)
CREATE TABLE IF NOT EXISTS wallet_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    token_type ENUM('life_1', 'life_3', 'life_6', 'life_9', 'diamond') NOT NULL,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wallet_token (wallet_id, token_type),
    INDEX idx_wallet_tokens_wallet_id (wallet_id),
    INDEX idx_wallet_tokens_type (token_type)
);

-- Create wallets for existing users (if any)
INSERT IGNORE INTO wallets (user_id, wallet_id)
SELECT id, wallet_id FROM users WHERE wallet_id IS NOT NULL;