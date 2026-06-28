const path = require("path");
const dotenv = require("dotenv");

// Load local secrets from backend/.env. This file should not be pushed to GitHub.
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// These are needed before the backend can safely start.
const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
// Checks each required variable and keeps track of the ones that are missing.
const missingVars = requiredVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
    console.error("Missing required environment variables: " + missingVars.join(", "));
    process.exit(1);
}

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};
