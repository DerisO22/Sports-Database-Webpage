-- Create Table Statements
CREATE TABLE IF NOT EXISTS genders (
    gender_id SERIAL PRIMARY KEY,
    gender VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS school_types (
    school_type_id SERIAL PRIMARY KEY,
    school_type VARCHAR(30) NOT NULL
);

-- User Auth
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Sports
CREATE TABLE IF NOT EXISTS sports (
    sport_id SERIAL PRIMARY KEY,
    sport_name VARCHAR(50) NOT NULL,
    sport_description TEXT, 
    has_gender_divisions BOOLEAN DEFAULT TRUE  
);

-- Schools
CREATE TABLE IF NOT EXISTS schools (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    school_type_id INTEGER NOT NULL,
    state VARCHAR(30),
    city VARCHAR(50),
    address VARCHAR(100),
    website VARCHAR(100),
    
    FOREIGN KEY (school_type_id) REFERENCES school_types(school_type_id)
);

-- Teams 
CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    school_id INTEGER NOT NULL,
    sport_id INTEGER NOT NULL,
    gender_id INTEGER, 
    season VARCHAR(20), 
    
    FOREIGN KEY (school_id) REFERENCES schools(school_id),
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (gender_id) REFERENCES genders(gender_id)
);

-- Players info
CREATE TABLE IF NOT EXISTS players (
    player_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender_id INTEGER,
    bio TEXT,
    
    FOREIGN KEY (gender_id) REFERENCES genders(gender_id)
);

-- Many-to-many relationship between players and teams
CREATE TABLE IF NOT EXISTS player_teams (
    player_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    jersey_number VARCHAR(10),
    position VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    
    PRIMARY KEY (player_id, team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Coaches
CREATE TABLE IF NOT EXISTS coaches (
    coach_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    bio TEXT
);

-- Many-to-many relationship between coaches and teams
CREATE TABLE IF NOT EXISTS coach_teams (
    coach_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    role VARCHAR(50), 
    
    PRIMARY KEY (coach_id, team_id),
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- News Cards
CREATE TABLE IF NOT EXISTS news (
    news_id SERIAL PRIMARY KEY,
    headline VARCHAR(100) NOT NULL,
    author VARCHAR(50),
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    sport_id INTEGER,
    team_id INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Events/competitions
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(100),
    description TEXT,
    sport_id INTEGER NOT NULL,
    
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
);

-- Many-to-many between teams and events
CREATE TABLE IF NOT EXISTS event_teams (
    event_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    score VARCHAR(20),
    placement INTEGER,
    
    PRIMARY KEY (event_id, team_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- 
-- Junction Tables
--
-- Many-to-many relationship between schools and sports
CREATE TABLE IF NOT EXISTS school_sports (
    school_id INTEGER NOT NULL,
    sport_id INTEGER NOT NULL,

    PRIMARY KEY (school_id, sport_id),
    FOREIGN KEY (school_id) REFERENCES schools (school_id),
    FOREIGN KEY (sport_id) REFERENCES sports (sport_id)
);

CREATE TABLE IF NOT EXISTS school_player (
    school_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,

    PRIMARY KEY (school_id, player_id),
    FOREIGN KEY (school_id) REFERENCES schools(school_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE IF NOT EXISTS news_school_sport_team (
    news_id INTEGER NOT NULL,
    school_id INTEGER NOT NULL,
    sport_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,

    PRIMARY KEY (news_id, school_id, sport_id, team_id),
    FOREIGN KEY (news_id) REFERENCES news(news_id),
    FOREIGN KEY (school_id) REFERENCES schools(school_id),
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);