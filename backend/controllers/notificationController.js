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

const markNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );

        res.status(200).json({ message: "Notifications marked read" });
    } catch (error) {
        res.status(500).json({ message: "Could not update notifications", error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.notificationId,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete notification", error: error.message });
    }
};

module.exports = {
    getNotifications,
    markNotificationsRead,
    deleteNotification
};
