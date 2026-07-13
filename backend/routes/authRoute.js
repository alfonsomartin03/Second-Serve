const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', (req, res, next) => {
    console.log("REGISTER ROUTE CALLED");
    next();
}, registerUser);

router.post('/login', loginUser);

module.exports = router;