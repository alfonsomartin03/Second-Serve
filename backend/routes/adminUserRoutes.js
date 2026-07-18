const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    getUsers,
    suspendUser,
    reactivateUser
} = require("../controllers/adminUserController");

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.patch("/users/:userId/suspend", protect, adminOnly, suspendUser);
router.patch("/users/:userId/reactivate", protect, adminOnly, reactivateUser);

module.exports = router;
