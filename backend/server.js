const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/env");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const adminUserRoutes = require("./routes/adminUserRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Simple route to make sure the backend is awake.
app.get("/api/health", (req, res) => {
    res.json({ message: "Second Serve backend is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/admin", adminUserRoutes);

// Connect to the database first, then start accepting requests.
mongoose.connect(config.mongoUri)
    .then(() => {
        app.listen(config.port, () => {
            console.log("Server running on port " + config.port);
        });
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB:");
        console.error(err.message);
        process.exit(1);
    });
