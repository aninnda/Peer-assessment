CREATE DATABASE IF NOT EXISTS bat_boys_db;

USE bat_boys_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,  
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor') NOT NULL,
    team VARCHAR(50) NOT NULL
);

INSERT IGNORE INTO users (username, password, role, name, team) VALUES
('dylan', 'Dylan123', 'student', 'Dylan Moos', 'bat boys'),
('samy', 'Samy123', 'student', 'Samy Mezimez', 'bat boys'),
('aninnda', 'Aninnda123', 'instructor', 'Aninnda Kumar Datta', 'Instructors');

CREATE TABLE IF NOT EXISTS ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    team VARCHAR(50) NOT NULL,
    conceptualContribution INT,
    practicalContribution INT,
    workEthic INT,
    cooperationRating INT,
    UNIQUE(name, team)
);

INSERT IGNORE INTO ratings (name, team, conceptualContribution, practicalContribution, workEthic, cooperationRating) VALUES
('Dylan Moos', 'bat boys', 3, 4, 5, 5),
('Samy Mezimez', 'bat boys', 4, 3, 5, 5);

CREATE TABLE IF NOT EXISTS teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(50) NOT NULL,
    students JSON NOT NULL
);

INSERT INTO teams (team_name, students) VALUES
('Bat Boys', '["Dylan Moos", "Samy Mezimez"]');
