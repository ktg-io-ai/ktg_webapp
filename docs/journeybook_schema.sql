-- JourneyBook database schema
-- Run this SQL to create the journeybook_answers table

CREATE TABLE IF NOT EXISTS journeybook_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    avatar_id INT NOT NULL,
    question_key VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_avatar_question (avatar_id, question_key),
    FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_avatar_answers ON journeybook_answers(avatar_id);
CREATE INDEX idx_question_key ON journeybook_answers(question_key);