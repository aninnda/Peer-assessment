const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('student', 'instructor')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Groups table
        db.run(`CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Group members table
        db.run(`CREATE TABLE IF NOT EXISTS group_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (group_id) REFERENCES groups(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE(group_id, user_id)
        )`);

        // Assessments table
        db.run(`CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reviewer_id INTEGER NOT NULL,
            reviewee_id INTEGER NOT NULL,
            group_id INTEGER NOT NULL,
            cooperation_score INTEGER CHECK(cooperation_score BETWEEN 1 AND 5),
            conceptual_score INTEGER CHECK(conceptual_score BETWEEN 1 AND 5),
            practical_score INTEGER CHECK(practical_score BETWEEN 1 AND 5),
            work_ethic_score INTEGER CHECK(work_ethic_score BETWEEN 1 AND 5),
            comments TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reviewer_id) REFERENCES users(id),
            FOREIGN KEY (reviewee_id) REFERENCES users(id),
            FOREIGN KEY (group_id) REFERENCES groups(id),
            UNIQUE(reviewer_id, reviewee_id, group_id)
        )`);
    });
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

function requireInstructor(req, res, next) {
    if (req.session && req.session.role === 'instructor') {
        next();
    } else {
        res.status(403).json({ error: 'Instructor access required' });
    }
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'student' && role !== 'instructor') {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }
                res.json({ message: 'User registered successfully', userId: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                req.session.username = user.username;
                req.session.role = user.role;
                res.json({ 
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error comparing passwords' });
        }
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
app.get('/api/user', requireAuth, (req, res) => {
    db.get('SELECT id, username, role FROM users WHERE id = ?', 
        [req.session.userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(user);
        }
    );
});

// Create group (instructor only)
app.post('/api/groups', requireAuth, requireInstructor, (req, res) => {
    const { name, memberIds } = req.body;
    
    if (!name || !memberIds || !Array.isArray(memberIds)) {
        return res.status(400).json({ error: 'Group name and member IDs are required' });
    }

    db.run('INSERT INTO groups (name) VALUES (?)', [name], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating group' });
        }
        
        const groupId = this.lastID;
        const stmt = db.prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
        
        memberIds.forEach(userId => {
            stmt.run(groupId, userId);
        });
        
        stmt.finalize((err) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding group members' });
            }
            res.json({ message: 'Group created successfully', groupId });
        });
    });
});

// Get all groups (instructor only)
app.get('/api/groups', requireAuth, requireInstructor, (req, res) => {
    db.all(`
        SELECT g.id, g.name, g.created_at,
               GROUP_CONCAT(u.username) as members
        FROM groups g
        LEFT JOIN group_members gm ON g.id = gm.group_id
        LEFT JOIN users u ON gm.user_id = u.id
        GROUP BY g.id
    `, (err, groups) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(groups);
    });
});

// Get user's groups
app.get('/api/user/groups', requireAuth, (req, res) => {
    db.all(`
        SELECT g.id, g.name, g.created_at
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
    `, [req.session.userId], (err, groups) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(groups);
    });
});

// Get group members
app.get('/api/groups/:groupId/members', requireAuth, (req, res) => {
    const groupId = req.params.groupId;
    
    db.all(`
        SELECT u.id, u.username
        FROM users u
        JOIN group_members gm ON u.id = gm.user_id
        WHERE gm.group_id = ? AND u.id != ?
    `, [groupId, req.session.userId], (err, members) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(members);
    });
});

// Submit assessment
app.post('/api/assessments', requireAuth, (req, res) => {
    const { revieweeId, groupId, cooperation, conceptual, practical, workEthic, comments } = req.body;
    
    if (!revieweeId || !groupId || !cooperation || !conceptual || !practical || !workEthic) {
        return res.status(400).json({ error: 'All scores are required' });
    }

    db.run(`
        INSERT OR REPLACE INTO assessments 
        (reviewer_id, reviewee_id, group_id, cooperation_score, conceptual_score, 
         practical_score, work_ethic_score, comments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.session.userId, revieweeId, groupId, cooperation, conceptual, practical, workEthic, comments],
    function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error submitting assessment' });
        }
        res.json({ message: 'Assessment submitted successfully', assessmentId: this.lastID });
    });
});

// Get assessment results for a user
app.get('/api/assessments/results/:userId', requireAuth, (req, res) => {
    const userId = req.params.userId;
    
    // Only allow users to view their own results or instructors to view anyone's
    if (req.session.role !== 'instructor' && req.session.userId != userId) {
        return res.status(403).json({ error: 'Access denied' });
    }

    db.all(`
        SELECT 
            AVG(cooperation_score) as avg_cooperation,
            AVG(conceptual_score) as avg_conceptual,
            AVG(practical_score) as avg_practical,
            AVG(work_ethic_score) as avg_work_ethic,
            COUNT(*) as total_assessments
        FROM assessments
        WHERE reviewee_id = ?
        GROUP BY reviewee_id
    `, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        db.all(`
            SELECT 
                u.username as reviewer_name,
                a.cooperation_score,
                a.conceptual_score,
                a.practical_score,
                a.work_ethic_score,
                a.comments,
                a.submitted_at
            FROM assessments a
            JOIN users u ON a.reviewer_id = u.id
            WHERE a.reviewee_id = ?
            ORDER BY a.submitted_at DESC
        `, [userId], (err, details) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                summary: results[0] || {},
                details: details
            });
        });
    });
});

// Get all students (instructor only)
app.get('/api/students', requireAuth, requireInstructor, (req, res) => {
    db.all('SELECT id, username FROM users WHERE role = "student"', (err, students) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(students);
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

module.exports = app;