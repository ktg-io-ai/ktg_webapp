-- Migration to fix avatar_journeybook_responses table
-- This script updates the table to use question_key instead of page_id
-- to properly match the frontend implementation

-- First, add the question_key column
ALTER TABLE avatar_journeybook_responses 
ADD COLUMN question_key VARCHAR(255) AFTER avatar_id;

-- Update existing records to use question_key format
UPDATE avatar_journeybook_responses 
SET question_key = CONCAT('page_', page_id) 
WHERE question_key IS NULL;

-- Make question_key NOT NULL
ALTER TABLE avatar_journeybook_responses 
MODIFY COLUMN question_key VARCHAR(255) NOT NULL;

-- Drop the old unique constraint
ALTER TABLE avatar_journeybook_responses 
DROP INDEX unique_avatar_page;

-- Add new unique constraint with question_key
ALTER TABLE avatar_journeybook_responses 
ADD UNIQUE KEY unique_avatar_question (avatar_id, question_key);

-- Drop the page_id column (optional - keep for now for safety)
-- ALTER TABLE avatar_journeybook_responses DROP COLUMN page_id;

-- Add index for faster queries
CREATE INDEX idx_avatar_responses_question ON avatar_journeybook_responses(question_key);