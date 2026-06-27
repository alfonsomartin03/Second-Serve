const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/env");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ message: "Second Serve backend is running" });
});

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
