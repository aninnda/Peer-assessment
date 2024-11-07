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
    resave: false,
    saveUninitialized: false
}));


app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
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

        const user = results[0]; // Get the first user returned by the query

        if (!user) {
            return res.status(400).send('Cannot find user');
        }

        // Check if the password matches (you might want to use bcrypt for hashing in production)
        if (password === user.password) {
            req.session.user = user;
            console.log(req.session.user, "blablabala");
            res.send({ message: 'Success', user: { name: user.username, role: user.role } });
        } else {
            return res.status(400).send('Incorrect password');
        }
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
        res.status(201).json({ message: 'Team created', teamId: result.insertId });
    });
});

app.get('/teams', (req, res) => {
    const loggedInUser = req.session.user;

    if (!loggedInUser) {
        return res.status(401).send('Unauthorized');
    }

    const query = `
    SELECT * FROM sttudents
    WHERE team_id = (
        SELECT team_id FROM students WHERE id = ? 
    ) AND id != ?`;

    db.query(query,[loggedInUser, loggedInUser] , (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(results);
    });
});

app.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('Unauthorized');
    }
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});