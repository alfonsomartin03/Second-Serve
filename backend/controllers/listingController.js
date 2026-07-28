const mongoose = require("mongoose");
const User = mongoose.model("User");
const Listing = require("../models/Listing");

// Attempt to create a new listing
const createListing = async (req, res) => {
  try {
    const { items, pickupInstructions } = req.body;

    const newListing = await Listing.create({
      donor: req.user.id,
      items,
      pickupInstructions,
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Server error. Could not create listing.",
      error: error.message,
    });
  }
};

// Retrieve marketplace listings using optional filters
const getListings = async (req, res) => {
  try {
    const { status, foodName, city, zipCode } = req.query;
    const queryObj = {};

    // Defaults to available listings
    queryObj.status = "available";

    if (foodName) {
      queryObj["items.name"] = {
        $regex: foodName,
        $options: "i",
      };
    }

    if (city || zipCode) {
      const donorFilter = {};

      if (city) {
        donorFilter.city = {
          $regex: `^${city}$`,
          $options: "i",
        };
      }

      if (zipCode) {
        donorFilter.zipCode = zipCode;
      }

      const matchingDonors = await User.find(donorFilter).select("_id");
      const donorIds = matchingDonors.map((donor) => donor._id);

      queryObj.donor = {
        $in: donorIds,
      };
    }

    const listings = await Listing.find(queryObj)
      .populate({
        path: "donor",
        select:
          "organizationName city state zipCode",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error("Error retrieving listings:", error);

    res.status(500).json({
      success: false,
      message: "Server error fetching marketplace listings",
      error: error.message,
    });
  }
};

// Retrieve dashboard listings based on the logged-in user's account type
const getDashboardListings = async (req, res) => {
  try {
    console.log("Dashboard route reached!");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
      });
    }
    let listings;

    if (req.user.accountType === "recipient") {
      listings = await Listing.find({
        status: "available",
        items: {
          $elemMatch: {
            expirationDate: { $gt: new Date() },
          },
        },
      })
        .populate({
          path: "donor",
          select:
            "organizationName contactName email phone address city state zipCode",
        })
        .sort({ createdAt: -1 });

    } else if (req.user.accountType === "donor") {
      listings = await Listing.find({
        donor: req.user._id,
      })
        .populate({
          path: "donor",
          select:
            "organizationName contactName email phone address city state zipCode",
        })
        .sort({ createdAt: -1 });

    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid account type.",
      });
    }

    res.status(200).json({
      success: true,
      accountType: req.user.accountType,
      count: listings.length,
      data: listings,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error fetching dashboard listings.",
      error: error.message,
    });
  }
};

module.exports = {
  createListing,
  getListings,
  getDashboardListings,
};