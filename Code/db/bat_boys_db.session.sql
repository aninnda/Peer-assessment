CREATE DATABASE IF NOT EXISTS bat_boys_db;

USE bat_boys_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'instructor') NOT NULL,
    team VARCHAR(50) DEFAULT NULL
);

INSERT IGNORE INTO users (username, password, role, name, team) VALUES
('dylan', 'Dylan123', 'student', 'Dylan Moos', 'bat boys'),
('samy', 'Samy123', 'student', 'Samy Mezimez', 'bat boys'),
('aninnda', 'Aninnda123', 'instructor', 'Aninnda Kumar Datta', '');

CREATE TABLE IF NOT EXISTS teams (
	team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name  VARCHAR(50) NOT NULL UNIQUE,
    members JSON DEFAULT NULL
);

INSERT IGNORE INTO teams (team_name, members) VALUES
('bat boys', JSON_ARRAY('dylan', 'samy'));

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rater_username VARCHAR(50) NOT NULL,
    rated_user VARCHAR(50) NOT NULL,
    team VARCHAR(50) NOT NULL,
    conceptualContribution INT,
    practicalContribution INT,
    workEthic INT,
    cooperation INT,
    comments TEXT DEFAULT NULL
);

INSERT IGNORE INTO ratings (rater_username, rated_user, team, conceptualContribution, practicalContribution, workEthic, cooperation, comments) VALUES
('dylan', 'samy', 'bat boys', 5, 5, 1, 5, 'Great work samy but you have no work ethics'),
('samy', 'dylan', 'bat boys', 5, 5, 5, 5, 'Great work dylan');