const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getDashboardListings,
} = require("../controllers/listingController");

const {
  protect,
  donorOnly,
} = require("../middleware/authMiddleware");

// Protected route to create new listings
router.post("/", protect, donorOnly, createListing);

// Public route to browse the marketplace
router.get("/", getListings);

router.get("/test", (req, res) => {
  res.json({ message: "Listing route works!" });
});

// Dashboard route for logged-in users
router.get("/dashboard", protect, getDashboardListings);

module.exports = router;