-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    display_name VARCHAR(50),
    avatar_url VARCHAR(255),
    bio TEXT
);

-- Game modes table
CREATE TABLE game_modes (
    mode_id SERIAL PRIMARY KEY,
    mode_name VARCHAR(50) UNIQUE NOT NULL,
    player_count INTEGER NOT NULL,
    description TEXT
);

-- Matches table
CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    mode_id INTEGER REFERENCES game_modes(mode_id),
    is_ranked BOOLEAN NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE
);

-- Match participants table
CREATE TABLE match_participants (
    match_id INTEGER REFERENCES matches(match_id),
    user_id INTEGER REFERENCES users(user_id),
    score INTEGER NOT NULL,
    PRIMARY KEY (match_id, user_id)
);

-- Tournaments table
CREATE TABLE tournaments (
    tournament_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    mode_id INTEGER REFERENCES game_modes(mode_id)
);

-- Tournament participants table
CREATE TABLE tournament_participants (
    tournament_id INTEGER REFERENCES tournaments(tournament_id),
    user_id INTEGER REFERENCES users(user_id),
    PRIMARY KEY (tournament_id, user_id)
);

-- User stats table
CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    total_points_scored INTEGER DEFAULT 0,
    rank_points INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX idx_matches_mode_id ON matches(mode_id);
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_user_id ON match_participants(user_id);
CREATE INDEX idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user_id ON tournament_participants(user_id);
