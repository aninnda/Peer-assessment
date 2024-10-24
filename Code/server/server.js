const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = { origin: 'http://localhost:5173', credentials: true }; //To allow requests from the client

const bcrypt = require('bcrypt'); //To hash passwords

const mysql = require('mysql'); //To connect to the database

const jwt = require('jsonwebtoken'); //To create auth
require('dotenv').config(); //Tokens secret key


//Database connection
const db = mysql.createConnection({
    server: "localhost",
    port: 3306,
    driver: "MySQL",
    name: "bat_boys_db",
    database: "bat_boys_db",
    username: "root"
});

//Connect to the database
connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to the database');
});

//Const user to be replaced with database
const users = [];


app.use(express.json());
app.use(cors(corsOptions));

//
//For now just testing
//
app.get('/ratings', authenticateToken, (req, res) => {
    req.json(users.filter(user => user.username === req.user.name));
    res.json();

});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/login', (req, res) => {
    res.json(users);
});

//Add users (register possibly)
app.post('/users', async (req, res) => {
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
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name && user.role === req.body.role); ;
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    const sql = 'SELECT * FROM users WHERE name = ? AND role = ?';
    connection.query(sql, [req.body.name, req.body.role], async (err, result) => {
        
        //If there is an error
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        //If there is no user
        if (result.lenght === 0) {
            return res.status(400).send('Cannot find user');
        }

        const user = result[0];
        try {
            if(await bcrypt.compare(req.body.password, user.password)) {
                const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
                res.send({ message: 'Success', accessToken: accessToken });
            } else {
                res.send('Not Allowed');
            }
        } catch {
            res.status(500).send();
        }
    })





});

//Check if user is authenticated
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

//Protected routes



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});