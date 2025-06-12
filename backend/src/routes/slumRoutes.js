const express = require("express");
const router = express.Router();
const slumController = require("../controllers/slumController");

// Wrapper for error handling
const safeRoute = (routeHandler) => async (req, res, next) => {
    try {
        await routeHandler(req, res, next);
    } catch (error) {
        console.error("❌ Route Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @route   GET /api/slums/data/:place
 * @desc    Fetch structured slum data (population, hospitals, schools, etc.)
 * @access  Public
 */
router.get("/data/:place", safeRoute(slumController.getSlumData));

/**
 * @route   POST /api/slums/predict
 * @desc    Run ML model to predict whether the area needs help
 * @access  Public
 */
router.post("/predict", safeRoute(slumController.predictSlumNeeds));

/**
 * @route   POST /api/slums/future-prediction
 * @desc    Predict potential future shortages in resources
 * @access  Public
 */
router.post("/future-prediction", safeRoute(slumController.predictFutureShortage));

/**
 * @route   POST /api/slums/update
 * @desc    Fetch data from external APIs and update database
 * @access  Admin (Future Scope)
 */
router.post("/update", safeRoute(slumController.updateSlumData));

module.exports = router;
