CREATE TABLE bat_boys_db.user (
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(50) NOT NULL, 
    role VARCHAR(50) NOT NULL, 
    name VARCHAR(50) NOT NULL, 
    team VARCHAR(50) NOT NULL);

<<<<<<< HEAD
INSERT INTO bat_boys_db.user (id, username, password, role, name, team) VALUES
(1, 'dylanM', 'Dylan123', 'Student', 'Dylan Moos', 'bat boys'),
(2, 'cemi', '123', 'Student', 'Samy Mezimez', 'bat boys'),
(3, 'aninnda', 'Aninnda123', 'Instructor', 'Aninnda Kumar Datta', 'Instructors');

CREATE TABLE bat_boys_db.ratings (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, 
    team VARCHAR(50) NOT NULL,
    conceptualContribution INT,
    practicalContribution INT,
    workEthic INT);

INSERT INTO bat_boys_db.ratings (id, name, team, conceptualContribution, practicalContribution, workEthic) VALUES
(1, 'Dylan Moos', 'bat boys', 3, 4, 5),
(2, 'Samy Mezimez', 'bat boys', 4, 3, 5);
=======
CREATE DATABASE bat_boys_db;

USE bat_boys_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    team VARCHAR(100)
);
>>>>>>> 0280ccb5e602c239a447a9cabf48ed3030c2cef9
