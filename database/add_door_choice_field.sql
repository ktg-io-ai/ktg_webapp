-- Add door_choice field to avatars table
ALTER TABLE avatars 
ADD COLUMN door_choice ENUM('blue', 'yellow', 'red') DEFAULT 'blue' AFTER tagline;

-- Update existing avatars with random door choices for testing
UPDATE avatars SET door_choice = 'blue' WHERE id % 3 = 1;
UPDATE avatars SET door_choice = 'yellow' WHERE id % 3 = 2;
UPDATE avatars SET door_choice = 'red' WHERE id % 3 = 0;