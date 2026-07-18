const mongoose = require("mongoose");

const adminActionLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        enum: ["suspend", "reactivate"],
        required: true
    },
    note: String
}, { timestamps: true });

module.exports = mongoose.model("AdminActionLog", adminActionLogSchema);
