-- Fix missing email column in user_creator_profiles table

-- Add email column to user_creator_profiles table
ALTER TABLE user_creator_profiles 
ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL AFTER id;

-- Add index for email lookups
CREATE INDEX idx_creator_profiles_email ON user_creator_profiles(email);