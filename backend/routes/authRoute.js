const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes and link them to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

// Export the router so server.js can use it
module.exports = router;