-- Add social media URL columns to user_creator_profiles table

ALTER TABLE user_creator_profiles 
ADD COLUMN instagram_url VARCHAR(255) NULL,
ADD COLUMN facebook_url VARCHAR(255) NULL,
ADD COLUMN linkedin_url VARCHAR(255) NULL,
ADD COLUMN tiktok_url VARCHAR(255) NULL,
ADD COLUMN x_url VARCHAR(255) NULL;