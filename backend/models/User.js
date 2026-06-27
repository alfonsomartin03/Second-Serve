const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["donor", "recipient", "admin"],
        required: true
    },

    organizationName: {
        type: String,
        required: true
    },

    phone: String,

    address: String
});

module.exports = mongoose.model("User", UserSchema);
