const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  foodItem: { 
    type: String, 
    required: [true, 'Food item name is required'] 
  },
  expirationDate: { 
    type: Date, 
    required: [true, 'Expiration date is required'] 
  },
  status: { 
    type: String, 
    enum: ['available', 'claimed', 'completed'], 
    default: 'available' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);