const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const User = UserModel.default || UserModel;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            return next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

// Used after protect when a route should only be available to admins.
const adminOnly = (req, res, next) => {
    if (req.user && req.user.accountType === "admin") {
        return next();
    }

    return res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, adminOnly };
