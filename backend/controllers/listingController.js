const mongoose = require("mongoose");
const User = mongoose.model("User");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// Attempt to create a new listing
const createListing = async (req, res) => {
  try {
    const { items, pickupInstructions } = req.body;

    const newListing = await Listing.create({
      donor: req.user.id,
      items,
      pickupInstructions,
    });

    const firstItem = items && items.length > 0 ? items[0].name : "Donation";

    // Let the donor know the donation update happened right away.
    await Notification.create({
      user: req.user.id,
      listing: newListing._id,
      donationName: firstItem,
      message: "Donation listing created.",
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
    const { status, foodName, city, state, zipCode } = req.query;
    const queryObj = {};

    // Defaults to available listings
    queryObj.status = "available";

    if (typeof foodName === "string") {
      queryObj["items.name"] = String(foodName);
    }

    if (
      typeof city === "string" ||
      typeof state === "string" ||
      typeof zipCode === "string"
    ) {
      const donorFilter = {};

      if (typeof city === "string") donorFilter.city = String(city);
      if (typeof state === "string") donorFilter.state = String(state);
      if (typeof zipCode === "string") donorFilter.zipCode = String(zipCode);

      const matchingDonors = await User.find(donorFilter).select("_id");
      const donorIds = matchingDonors.map((donor) => donor._id);

      queryObj.donor = {
        $in: donorIds,
      };
    }

    const listings = await Listing.find({ ...queryObj })
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

    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
      });
    }
    let listings;

    // console.log("User account type:", req.user.accountType);
    if (req.user.accountType === "recipient") {
      listings = await Listing.find({
          $or: [
              {
                  status: "available",
                  items: {
                      $elemMatch: {
                          expirationDate: {
                              $gt: new Date()
                          }
                      }
                  }
              },
              {
                  status: "reserved",
                  reservedBy: req.user._id
              }
          ]
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

// Recipient reserves a listing
const reserveListing = async (req, res) => {
  
  try {
    const { pickupDateTime } = req.body;

    if (!pickupDateTime) {
      return res.status(400).json({
        success: false,
        message: "Pickup date/time is required.",
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    // Already reserved?
    if (listing.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This listing is no longer available.",
      });
    }

    // Find earliest expiration date
    const earliestExpiration = listing.items.reduce((earliest, item) => {
      if (!earliest || item.expirationDate < earliest) {
        return item.expirationDate;
      }
      return earliest;
    }, null);

    const pickup = new Date(pickupDateTime);

    if (pickup >= earliestExpiration) {
      return res.status(400).json({
        success: false,
        message: "Pickup must occur before the food expires.",
      });
    }

    listing.status = "reserved";
    listing.reservedBy = req.user._id;
    listing.reservedAt = new Date();
    listing.pickupDateTime = pickup;

    await listing.save();

    res.json({
      success: true,
      message: "Listing reserved successfully.",
      data: listing,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


module.exports = {
  createListing,
  getListings,
  getDashboardListings,
  reserveListing,
};