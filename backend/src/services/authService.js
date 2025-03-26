require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

/**
 * Generate JWT token for user authentication
 * @param {Object} user - User object (should contain an ID or unique identifier)
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded user object or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("❌ Invalid token:", error.message);
        return null;
    }
};

/**
 * Hash user password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare user-entered password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} - True if passwords match, otherwise false
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
