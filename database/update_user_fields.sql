-- Update users table to have account-level profile fields
ALTER TABLE users 
ADD COLUMN user_image TEXT,
ADD COLUMN account_title VARCHAR(255);

-- This creates a clear separation:
-- users table = account profile (user_image, account_title)
-- avatars table = gaming avatars (multiple per wallet)
-- wallets table = connects users to their avatars and tokens