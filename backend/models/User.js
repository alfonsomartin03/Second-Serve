import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    enum: ["donor", "recipient", "admin"],
    required: true,
  },

  organizationName: {
    type: String,
    required: true,
  },

  contactName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
});

export default mongoose.model("User", userSchema);
