const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getNotifications,
    markNotificationsRead,
    deleteNotification
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/read", protect, markNotificationsRead);
router.delete("/:notificationId", protect, deleteNotification);

module.exports = router;
