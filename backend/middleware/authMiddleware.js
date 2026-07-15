const jwt = require("jsonwebtoken");
const User = require("../models/User").default;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-passwordHash");
            return next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

// Used after protect when a route should only be available to donors.
const donorOnly = (req, res, next) => {
  if (req.user && req.user.accountType === "donor") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Donor account required." });
};

module.exports = { protect, donorOnly };