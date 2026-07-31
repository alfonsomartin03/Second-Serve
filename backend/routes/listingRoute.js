const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getDashboardListings,
  reserveListing,
} = require("../controllers/listingController");

const {
  protect,
  donorOnly,
  recipientOnly,
} = require("../middleware/authMiddleware");

//debugging logs
console.log("protect:", typeof protect);
console.log("recipientOnly:", typeof recipientOnly);
console.log("reserveListing:", typeof reserveListing);

// Protected route to create new listings
router.post("/", protect, donorOnly, createListing);
// Dashboard route for logged-in users
router.get("/dashboard", protect, getDashboardListings);

// Public route to browse the marketplace
router.get("/", getListings);

// Protected route to reserve a listing
router.patch("/:id/reserve", protect, recipientOnly, reserveListing);

//debugging logs
console.log("protect:", protect);
console.log("recipientOnly:", recipientOnly);
console.log("reserveListing:", reserveListing);

module.exports = router;