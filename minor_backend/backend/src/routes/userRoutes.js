const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// console.log("User Controller:", userController);
// // Safe route handler to prevent unhandled errors
// console.log(" Auth Middleware:", authMiddleware);

const safeRoute = (handler) => async (req, res, next) => {
    try {
        await handler(req, res, next);
    } catch (error) {
        console.error("❌ Route Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", safeRoute(userController.registerUser));

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and get JWT token
 * @access  Public
 */
router.post("/login", userController.loginUser);

/**
 * @route   GET /api/users/profile/:id
 * @desc    Get user profile (protected)
 * @access  Private (Requires Authentication)
 */
router.get("/profile/:id", authMiddleware.verifyToken, userController.getUserProfile);

/**
 * @route   PUT /api/users/update/:id
 * @desc    Update user profile (protected)
 * @access  Private (Requires Authentication)
 */
router.put("/update/:id", authMiddleware.verifyToken, userController.updateUserProfile);

/**
 * @route   DELETE /api/users/delete/:id
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin Only)
 */
router.delete("/delete/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
