const Slum = require("../models/Slum"); // Slum schema
const axios = require("axios"); // For external API requests
const { analyzeSlumNeeds, predictResourceShortage } = require("../services/mlService");
const { getPopulation, getHealthcareFacilities, getSchools, getToilets, getWaterAccessData } = require("../services/resourceService");

/**
 * @route   GET /api/slums/:place
 * @desc    Get stored slum data for a given place
 * @access  Public
 */
const getSlumInfo = async (req, res) => {
    try {
        const { place } = req.params;
        if (!place) {
            return res.status(400).json({ success: false, message: "Place parameter is required" });
        }

        const slumData = await Slum.findOne({ place });

        if (!slumData) {
            return res.status(404).json({ success: false, message: "Slum data not found" });
        }

        res.status(200).json({ success: true, data: slumData });
    } catch (error) {
        console.error("❌ Error fetching slum data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * @route   POST /api/slums/analyze
 * @desc    Analyze slum area using ML model
 * @access  Public
 */
const analyzeSlumData = async (req, res) => {
    try {
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: "Latitude and Longitude are required" });
        }

        // Fetch external data based on lat/lon
        const population = await getPopulation(lat, lon);
        const hospitals = await getHealthcareFacilities(lat, lon);
        const schools = await getSchools(lat, lon);
        const toilets = await getToilets(lat, lon);
        const waterAccess = await getWaterAccessData(lat, lon);

        if (population === null) {
            return res.status(404).json({ success: false, message: "Population data not available" });
        }

        // Analyze if the place needs assistance
        const needAssistance = await analyzeSlumNeeds({
            population,
            hospitals,
            schools,
            toilets,
            waterAccess
        });

        // Predict future shortages
        const futureShortage = await predictResourceShortage({
            population,
            hospitals,
            schools,
            toilets,
            waterAccess
        });

        res.status(200).json({ 
            success: true, 
            data: { lat, lon, population, hospitals, schools, toilets, waterAccess, needAssistance, futureShortage } 
        });
    } catch (error) {
        console.error("❌ Error analyzing slum data:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * @route   GET /api/slums/fetch-external/:place
 * @desc    Fetch slum-related data from external APIs
 * @access  Public
 */
const fetchExternalSlumData = async (req, res) => {
    try {
        const { place } = req.params;
        if (!place) {
            return res.status(400).json({ success: false, message: "Place parameter is required" });
        }

        const API_URL = `https://external-api.com/data?place=${encodeURIComponent(place)}`; // Replace with actual API

        const response = await axios.get(API_URL);
        const externalData = response.data;

        res.status(200).json({ success: true, data: externalData });
    } catch (error) {
        console.error("❌ Error fetching external slum data:", error);
        res.status(500).json({ success: false, message: "Failed to fetch external data", error: error.message });
    }
};

module.exports = { getSlumInfo, analyzeSlumData, fetchExternalSlumData };
