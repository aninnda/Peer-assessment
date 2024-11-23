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
('daniel', 'Daniel123', 'student', 'Daniel Pinto', 'team 2'),
('aymen', 'Aymen123', 'student', 'Aymen Mefti', 'team 2'),
('karim', 'Karim123', 'student', 'Karim Naja', 'team 2'),
('alexander', 'Alex123', 'student', 'Alexander Smith', NULL),
('bethany', 'Beth123', 'student', 'Bethany Lee', NULL),
('chris', 'Chris123', 'student', 'Chris Johnson', NULL),
('diana', 'Diana123', 'student', 'Diana Garcia', NULL),
('evan', 'Evan123', 'student', 'Evan Martinez', NULL),
('fiona', 'Fiona123', 'student', 'Fiona Brown', NULL),
('george', 'George123', 'student', 'George Clark', NULL),
('hannah', 'Hannah123', 'student', 'Hannah Lewis', NULL),
('isaac', 'Isaac123', 'student', 'Isaac Walker', NULL),
('julie', 'Julie123', 'student', 'Julie Hall', NULL),
('aninnda', 'Aninnda123', 'instructor', 'Aninnda Kumar Datta', 'Instructor');

CREATE TABLE IF NOT EXISTS teams (
	team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name  VARCHAR(50) NOT NULL UNIQUE,
    members JSON DEFAULT NULL
);

INSERT IGNORE INTO teams (team_name, members) VALUES
('bat boys', JSON_ARRAY('dylan', 'samy')),
('team 2', JSON_ARRAY('daniel', 'aymen', 'karim'));


CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rater_username VARCHAR(50) NOT NULL,
    rated_username VARCHAR(50) NOT NULL,
    rated_name VARCHAR(50) NOT NULL,
    team VARCHAR(50) NOT NULL,
    conceptualContribution INT,
    practicalContribution INT,
    workEthic INT,
    cooperation INT,
    comments TEXT DEFAULT NULL,
    UNIQUE (rater_username, rated_username)
);

--INSERT IGNORE INTO ratings (rater_username, rated_username, team, conceptualContribution, practicalContribution, workEthic, cooperation, comments) VALUES
--('dylan', 'samy', 'bat boys', 5, 5, 1, 5, 'Great work samy but you have no work ethics'),
--('samy', 'dylan', 'bat boys', 5, 5, 5, 5, 'Great work dylan');

CREATE TABLE IF NOT EXISTS forum (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(50) NOT NULL,
    content TEXT NOT NULL
);