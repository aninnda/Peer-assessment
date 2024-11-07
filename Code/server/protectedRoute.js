const express = require('express');
const router = express.Router();
const verifyToken = require('./authMiddleware');
const connection = require('./db');

//Protected route
// router.get('/teams', verifyToken, (req, res) => {
//     const query = 'SELECT * FROM teams';
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send();
//         }
//         res.json(results);
//     });
// });

// router.get('/ratings', verifyToken, (req, res) => {
//     const query = 'SELECT * FROM ratings';
//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).send();
//         }
//         res.json(results);
//     });
// });

// module.exports = router;
//TO FIX:
//Protected routes are in the backend.
//The frontend needs to be able to access these routes.
//The frontend routes need to be auth locked.