const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Could not load notifications", error: error.message });
    }
};

module.exports = {
    getNotifications
};
