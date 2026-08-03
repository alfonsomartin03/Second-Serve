const UserModel = require("../models/User");
const User = UserModel.default || UserModel;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

//Attempt to register a new user and handle errors
exports.registerUser = async (req, res) => {

    try {
        const {
            accountType,
            organizationName,
            contactName,
            email,
            password,
            phone,
            address,
            city,
            state,
            zipCode
        } = req.body;

        //Check if user already exists
        if (typeof email !== 'string') {
            return res.status(400).json({ message: "Invalid email format" });
}
        const userExists = await User.findOne({ email: String(email) });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        //Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedSecurePassword = await bcrypt.hash(password, salt);

        //Create the new user in the database
        const newUser = await User.create({
            accountType,
            organizationName,
            contactName,
            email,
            password: hashedSecurePassword,
            phone,
            address,
            city,
            state,
            zipCode
        });

        //Confirm successful creation
        res.status(201).json({
            message: "User registered successfully!",
            userId: newUser._id,
            token: generateToken(newUser._id) 
        });

    } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
        message: "Server error",
        error: error.message
    });
}
};

//Attempt to login a user and handle errors
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Find user by email
        if (typeof email !== 'string') {
            return res.status(400).json({ message: "Invalid email format" });
        }
        
        const user = await User.findOne({ email: String(email) });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //Compare entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.accountStatus === "suspended") {
            return res.status(403).json({ message: "Account is suspended" });
        }

        //Confirm successful authentication
        res.status(200).json({
            message: "Logged in successfully!",
            userId: user._id,
            accountType: user.accountType,
            organizationName: user.organizationName,
            contactName: user.contactName,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
