const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = { origin: 'http://localhost:5173', credentials: true }; //To allow requests from the client
const bcrypt = require('bcrypt'); //To hash passwords
const mysql = require('mysql'); //To connect to the database


//Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
});

//Const user to be replaced with database
const users = [

];

app.use(express.json());
app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    
    res.json();

});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/login', (req, res) => {
    res.json(users);
});

//Add users (register)
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
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
            req.session.user = user;
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

//Check if user is authenticated
function authenticateToken(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    } 
}

//Protected routes



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});