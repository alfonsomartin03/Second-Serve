const express = require('express');
const router = express.Router();

const { createListing } = require('../controllers/listingController');
const { protect, donorOnly } = require('../middleware/authMiddleware'); 


router.post('/', protect, donorOnly, createListing);

module.exports = router;