CREATE TABLE bat_boys_db.user (
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL, 
    password VARCHAR(50) NOT NULL, 
    role VARCHAR(50) NOT NULL, 
    name VARCHAR(50) NOT NULL, 
    team VARCHAR(50) NOT NULL);

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