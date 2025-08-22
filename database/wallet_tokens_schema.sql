-- Wallet Tokens Table for MySQL Database
CREATE TABLE IF NOT EXISTS wallet_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    token_type ENUM('life_1', 'life_3', 'life_6', 'life_9', 'diamond') NOT NULL,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wallet_token (wallet_id, token_type)
);

-- Index for faster queries
CREATE INDEX idx_wallet_tokens_wallet_id ON wallet_tokens(wallet_id);
CREATE INDEX idx_wallet_tokens_type ON wallet_tokens(token_type);