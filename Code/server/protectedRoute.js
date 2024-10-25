const express = require('express');
const router = express.Router();
const verifyToken = require('./authMiddleware');


//Protected route
router.get('/teams', verifyToken, (req, res) => {
    res.status(200).send('Protected route accessed');
});

router.get('ratings', verifyToken, (req, res) => {
    res.status(200).send('Protected route accessed');
});

//TO FIX:
//Protected routes are in the backend.
//The frontend needs to be able to access these routes.
//The frontend routes need to be auth locked.