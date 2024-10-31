CREATE DATABASE if NOT EXISTS bat_boys_db;

USE bat_boys_db;

CREATE TABLE if NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    role ENUM('student', 'instructor') NOT NULL, 
    team VARCHAR(50) NOT NULL);

INSERT INTO bat_boys_db.users (username, password, role, name, team) VALUES
('dylan', 'Dylan123', 'Student', 'Dylan Moos', 'bat boys'),
('samy', 'Samy123', 'Student', 'Samy Mezimez', 'bat boys'),
('aninnda', 'Aninnda123', 'Instructor', 'Aninnda Kumar Datta', 'Instructors');

CREATE TABLE bat_boys_db.ratings (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, 
    team VARCHAR(50) NOT NULL,
    conceptualContribution INT,
    practicalContribution INT,
    workEthic INT,
    cooperationRating INT);

INSERT INTO bat_boys_db.ratings (name, team, conceptualContribution, practicalContribution, workEthic, cooperationRating) VALUES
('Dylan Moos', 'bat boys', 3, 4, 5, 5),
('Samy Mezimez', 'bat boys', 4, 3, 5, 5);


