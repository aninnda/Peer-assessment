//Backend
const express = require('express');
const app = express();

//To fetch from db
const users = [];

//To insert users from db?? TESTING REQUIRED TO SEE IF THIS WORKS
app.get('/users', async (req, res) => {
    try {
        const users = await executeQuery('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
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
//Needs to be writen without db to make it universal. Make db connect some other way.
//Possibly store temporarly needed data fetched from database to login instead of fetching directly from db.

app.post('/users/loginWithToken', verifyToken, (req, res) => {
    const user = users.find(user => user.name === req.user.name && user.role === req.user.role);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    res.send({ message: 'User authenticated', user: user });
});
//Needs to be incorporated into other routes along with login logic.




export default auth;