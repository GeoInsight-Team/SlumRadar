const express = require("express");
const { generateToken, verifyToken, hashPassword, comparePassword } = require("../services/authService");
const User = require("../models/User"); // Import User model

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password and create new user
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Middleware to protect routes
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
};

// Protected route example
router.get("/protected-route", authenticateUser, (req, res) => {
    res.json({ success: true, message: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
