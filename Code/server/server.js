//Backend
const express = require('express');
const app = express();

// Cookies
//const cookieParser = require('cookie-parser');
const session = require('express-session');

//Communication with frontend
const cors = require('cors');
const corsOptions = { origin: 'http://localhost:5173', credentials: true }; //To allow requests from the client

//Database
const db = require('./db.js');
//Remove when db.js + auth.js is setup
//const { executeQuery } = require('./db.js'); //To execute queries

//Authorization and authentication
//const auth = require('./auth.js');
const verifyToken = require('./authMiddleware');
const jwt = require('jsonwebtoken'); //To create auth
require('dotenv').config(); //Tokens secret key
const bcrypt = require('bcrypt'); //To hash passwords



app.use(express.json());
app.use(cors(corsOptions));
//app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    }
}));


app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        console.log(req.session.user);
        res.json(results);
    });
});

//Add users (register possibly)
app.post('/users', async (req, res) => {
    try {
        const user = { name: req.body.username, password: req.body.password, role: req.body.role };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', (req, res) => {
    const { name, password, role } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
    db.query(query, [name, role], (error, results) => {
        if (error) {
            console.error('Error querying the database:', error);
            return res.status(500).send('Internal server error');
        }
        const user = results[0];
        if (!user || password !== user.password) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }
        req.session.user = user;
        res.status(200).send({ message: 'Success', user: { name: user.username, role: user.role } });
    });
});


// Create teams
app.post('/teams', async (req, res) => {
    const { teamName, selectedStudents } = req.body;
    const query = 'INSERT INTO teams (team_name, members) VALUES (?, ?)';
    const studentsJson = JSON.stringify(selectedStudents);
    db.query(query, [teamName, studentsJson], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send();
        }
        res.status(201).json({ message: 'Team created', team: { name: teamName, teamId: result.insertId } });
    });
});


app.get('/teams', (req, res) => {
    const query = 'SELECT * FROM teams';

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(results);
    });
});

app.post('/teams/assign', (req, res) => {
    const { studentId, teamId } = req.body;
    // Logic for assigning students to a team
    res.status(200).send({ message: 'Student assigned to team successfully' });
});


app.get('/session', (req, res) => {
    res.json(req.session.user);
})

app.post('/session', (req, res) => {
    req.session.user = req.body;
    res.send();
})



app.post('/ratings', (req, res) => {
    const { rater_username, rated_username, team_name, ratings, comments } = req.body;  

    const query = `INSERT INTO ratings (rater_username, rated_username, team_name, 
    conceptual_contribution, practical_contribution, work_ethic, cooperation, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        rater_username,
        rated_username,
        team_name,
        ratings.conceptual,
        ratings.practical,
        ratings.workEthic,
        ratings.cooperation,
        comments
    ];
    db.query(query, values, (err) => {
        if (err) {
          console.error('Error saving rating:', err);
          res.status(500).send('Error saving rating');
        } else {
          res.status(200).send('Rating saved successfully');
        }
    });
});

module.exports = app;