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
    });
  }
};

module.exports = {
  createListing,
};