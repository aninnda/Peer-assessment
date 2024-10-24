CREATE Table bat_boys_db.testTable(id int, name varchar(50))

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