//Backend
const express = require('express');
const app = express();

//Communication with frontend
const cors = require('cors');
const corsOptions = { origin: 'http://localhost:5173', credentials: true }; //To allow requests from the client

//Database
const mysql = require('mysql'); //To connect to the database
const connection = require('./db.js');
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


//Const user to be replaced with database
const users = []; //Should be in db.js

//
//For now just testing
//
// app.get('/ratings', verifyToken, (req, res) => {
//     req.json(users.filter(user => user.username === req.user.name));
//     res.json();

// });

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        res.json(results);
    });
});

app.get('/users/loginT', (req, res) => {
    res.json(users);
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

//Version with hash
app.post('/usersttttt', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //console.log(salt);
        //console.log(hashedPassword);
        const user = { name: req.body.name, password: hashedPassword, role: req.body.role };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});


//Login
app.post('/users/loginTTTT', async (req, res) => {
    const user = users.find(user => user.name === req.body.name && user.role === req.body.role); ;
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    //const sql = 'SELECT * FROM users WHERE name = ? AND role = ?';
    //To remove when auth.js is setup
    //connection.query(sql, [req.body.name, req.body.role], async (err, result) => {
        
        //If there is an error
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        //If there is no user
        if (result.lenght === 0) {
            return res.status(400).send('Cannot find user');
        }

        //const user = result[0];
        try {
            if(await bcrypt.compare(req.body.password, user.password)) {
                //const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
                //res.send({ message: 'Success', accessToken: accessToken });
            } else {
                res.send('Not Allowed');
            }
        } catch {
            res.status(500).send();
        }
    //})
});

app.post('/users/login', async (req, res) => {
    const { name, password, role } = req.body;

    try {
        // Query the database for the user
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND role = ?',
            [name, role]
        );

        const user = rows[0]; // Get the first user returned by the query

        if (!user) {
            return res.status(400).send('Cannot find user');
        }

        // Check if the password matches (you might want to use bcrypt for hashing in production)
        if (password === user.password) {
            res.send({ message: 'Success', user: { name: user.name, role: user.role } });
        } else {
            return res.status(400).send('Incorrect password');
        }
    } catch (error) {
        console.error('Error querying the database:', error);
        return res.status(500).send('Internal server error');
    }
});



////Version with hash
app.post('/users/loginhash', async (req, res) => {
    const user = users.find(user => user.username === req.body.name && user.role === req.body.role);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send({ message: 'Success', user: { name: user.name, role: user.role } });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});



app.post('/users/loginWithToken', verifyToken, (req, res) => {
    const user = users.find(user => user.name === req.user.name && user.role === req.user.role);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    res.send({ message: 'User authenticated', user: user });
});




app.listen(3000, () => {
    console.log('Server is running on port 3000');
});