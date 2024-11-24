//Backend
const express = require('express');
const app = express();

// Cookies
const session = require('express-session');

//Communication with frontend
const cors = require('cors');
const corsOptions = { origin: 'http://localhost:5173', credentials: true }; //To allow requests from the client

//Database
const db = require('./db.js');

//Authorization and authentication
require('dotenv').config(); //Tokens secret key


app.use(express.json());
app.use(cors(corsOptions));
app.use(session({
    secret: 'secret',
    resave: false,
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
        const updateQuery = 'UPDATE users SET team = ? WHERE username = ?';
        selectedStudents.forEach(student => {
            db.query(updateQuery, [teamName, student], (err) => {
                if (err) {
                    console.error(`Error updating team for student ${student}:`, err);
                }
            });
        });
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



app.get('/ratings', (req, res) => { 

    const loggedInUsername = req.session.user.username;  // Save username
    // Find current user's team
    const teamQuery = 'SELECT team FROM users WHERE username = ?';

    db.query(teamQuery, [loggedInUsername], (err, teamResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error finding team');
        }

        const teamName = teamResults[0]?.team;

        if (!teamName) {
            return res.status(404).send('Team not found for the user');
        }

        // Find team members
        const membersQuery = 'SELECT username FROM users WHERE team = ?';

        db.query(membersQuery, [teamName], (err, membersResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving team members');
            }

            const teamMembers = membersResults.map(member => member.username);
            res.json(teamMembers);
        });
    });
});

app.post('/ratings', (req, res) => {
    const { rater_username, rated_username, rated_name, team, ratings, comments } = req.body;  

    const query = `
        INSERT INTO ratings (rater_username, rated_username, rated_name, team, conceptualContribution, practicalContribution, workEthic, cooperation, comments) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            conceptualContribution = VALUES(conceptualContribution),
            practicalContribution = VALUES(practicalContribution),
            workEthic = VALUES(workEthic),
            cooperation = VALUES(cooperation),
            comments = VALUES(comments)
        `;

    const values = [
        rater_username,
        rated_username,
        rated_name,
        team,
        ratings.conceptual,
        ratings.practical,
        ratings.ethic,
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

app.get('/average-ratings', async (req, res) => {
    try {
      // SQL query to calculate averages for each student
      const query = `
        SELECT 
          rated_username AS student_id,
          team,
          AVG(cooperation) AS cooperation_avg,
          AVG(conceptualContribution) AS conceptual_avg,
          AVG(practicalContribution) AS practical_avg,
          AVG(workEthic) AS work_ethic_avg,
          (AVG(cooperation) + AVG(conceptualContribution) + AVG(practicalContribution) + AVG(workEthic)) / 4 AS overall_avg,
          COUNT(rater_username) AS peers_responded
        FROM ratings
        GROUP BY rated_username, team
      `;
  
      // Execute the query
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching average ratings:', err);
          res.status(500).json({ message: 'Error fetching average ratings' });
          return;
        }
        res.status(200).json(results);
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


app.get("/other", (req, res) => {
    db.query("SELECT * FROM forum", (err, results) => {
      if (err) {
        throw err;
    } else {
      res.json(results);
    }
    });
  });

  app.post("/other", (req, res) => {
    const author = req.session.user.username;
    const { commentText, commentDate } = req.body;
    const query = "INSERT INTO forum (author, content) VALUES (?, ?)";
    db.query(query, [author, commentText, commentDate], (err, results) => {
      if (err) {
        console.error('Error inserting comment:', err);
        return res.status(500).json({ message: 'Error inserting comment' });
      }
      db.query("SELECT * FROM forum WHERE id = ?", [results.insertId], (err, newComment) => {
        if (err) {
          console.error('Error fetching new comment:', err);
          return res.status(500).json({ message: 'Error fetching new comment' });
        }
        res.status(201).json(newComment[0]);
      });
    });
});


app.get('/test-session', (req, res) => {
    req.session.testData = 'Hello, session!';
    res.send('Session data set');
});

app.get('/retrieve-session', (req, res) => {
    res.send(req.session.userRole || 'No session data');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
