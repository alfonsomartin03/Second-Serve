<<<<<<< HEAD
=======
const mongoose = require('mongoose');
const User = mongoose.model('User');
>>>>>>> 1094ae42e21df56e051bcbf46e7421df0d45b948
const Listing = require('../models/Listing');

//Attempt to create a new listing
const createListing = async (req, res) => {
  try {
    const { items, pickupInstructions } = req.body;

    //Create the new listing
    const newListing = await Listing.create({
      donor: req.user.id, 
      items,
      pickupInstructions
    });

    //Return the created listing with a success status
    res.status(201).json(newListing);
  } 
  
<<<<<<< HEAD
  //Return an error status if lsiting fails
  catch (error) {
    console.error('Error creating listing:', error);

    // Handle Mongoose validation errors explicitly
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Server error. Could not create listing.', 
      error: error.message 
=======
  //Return an error status if listing fails
  catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error. Could not create listing.', error: error.message });
  }
};

//Attempt to retrieve listings
const getListings = async (req, res) => {
  try {
    const { status, foodName, city, zipCode } = req.query;
    let queryObj = {};

    //Filter by status (defaults to 'available' if not specified)
    if (status) {
      queryObj.status = status;
    } else {
      queryObj.status = 'available';
    }

    //Filter by foodItem name (case insensitive partial match within the items array)
    if (foodName) {
      queryObj['items.name'] = { $regex: foodName, $options: 'i' };
    }

    //Filter by location (city or zip code)
    if (city || zipCode) {
      let donorFilter = {};
      
      //Case insensitive exact match for city
      if (city) {
        donorFilter.city = { $regex: `^${city}$`, $options: 'i' };
      }
      if (zipCode) {
        donorFilter.zipCode = zipCode;
      }

      //Find all donor IDs that match the location criteria
      const matchingDonors = await User.find(donorFilter).select('_id');
      const donorIds = matchingDonors.map(donor => donor._id);

      //Only return listings created by those specific donors
      queryObj.donor = { $in: donorIds };
    }

    //Fetch listings and populate the donor's profile (excluding password)
    const listings = await Listing.find(queryObj)
      .populate({
        path: 'donor',
        select: 'organizationName contactName email phone address city state zipCode'
      })
      .sort({ createdAt: -1 });

    //Return the listings with a success status
    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } 

  //Return an error status if retrieval fails
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error fetching marketplace listings',
      error: error.message,
>>>>>>> 1094ae42e21df56e051bcbf46e7421df0d45b948
    });
  }
};

<<<<<<< HEAD
module.exports = {
  createListing,
};
=======
module.exports = { createListing, getListings };
>>>>>>> 1094ae42e21df56e051bcbf46e7421df0d45b948
