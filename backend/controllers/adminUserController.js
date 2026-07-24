const UserModel = require("../models/User");
const User = UserModel.default || UserModel;
const AdminActionLog = require("../models/AdminActionLog");

// Admin view for the accounts list.
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ email: 1 });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Shared helper for suspend/reactivate so the two routes stay simple.
const updateAccountStatus = async (req, res, status, action) => {
    try {
        if (req.user._id.toString() === req.params.userId) {
            return res.status(400).json({ message: "Admins cannot change their own account status" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.accountStatus = status;
        await user.save();

        await AdminActionLog.create({
            admin: req.user._id,
            targetUser: user._id,
            action,
            note: req.body && req.body.note
        });

        res.status(200).json({
            message: "User account updated",
            userId: user._id,
            accountStatus: user.accountStatus
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.suspendUser = async (req, res) => {
    return updateAccountStatus(req, res, "suspended", "suspend");
};

exports.reactivateUser = async (req, res) => {
    return updateAccountStatus(req, res, "active", "reactivate");
};
