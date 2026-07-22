const mongoose = require('mongoose');

//Individual food item schema
const FoodItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Food item name is required'],
    trim: true
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: { 
    type: String, 
    enum: ['lbs', 'oz', 'kg', 'l', 'boxes', 'items', 'servings', 'bags'], 
    required: [true, 'Unit of measurement is required'] 
  },
  expirationDate: { 
    type: Date, 
    required: [true, 'Expiration date is required'] 
  },
});

//Donation listing schema
const ListingSchema = new mongoose.Schema({
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  //Array of food items
  items: {
    type: [FoodItemSchema],
    validate: [arrayMinLength, 'A donation must contain at least one food item']
  },
  status: { 
    type: String, 
    enum: ['available', 'claimed', 'completed', 'cancelled'], 
    default: 'available' 
  },
  pickupInstructions: {
    type: String,
    trim: true
  }
}, { timestamps: true });

function arrayMinLength(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Listing', ListingSchema);
