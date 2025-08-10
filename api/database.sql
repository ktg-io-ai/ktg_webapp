-- KTG Webapp Database Schema
CREATE DATABASE ktg_webapp;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- JourneyBook responses
CREATE TABLE journeybook (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User sessions (optional for JWT blacklisting)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_journeybook_user_id ON journeybook(user_id);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);