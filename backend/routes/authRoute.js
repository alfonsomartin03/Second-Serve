const express = require('express');
const router = express.Router();

// Import middleware functions
const { protect } = require("../middleware/authMiddleware");

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes and link them to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get("/profile", protect, (req, res) => {
    res.json({ 
        message: "Welcome to your protected profile!", 
        user: req.user 
    });
});

// Export the router so server.js can use it
module.exports = router;