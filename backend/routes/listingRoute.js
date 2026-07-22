const express = require('express');
const router = express.Router();

const { createListing, getListings } = require('../controllers/listingController');
const { protect, donorOnly } = require('../middleware/authMiddleware'); 

//Protected route to create new listings
router.post('/', protect, donorOnly, createListing);

//Public route to browse the marketplace
router.get('/', getListings);

module.exports = router;