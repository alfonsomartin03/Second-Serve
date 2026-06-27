const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
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
