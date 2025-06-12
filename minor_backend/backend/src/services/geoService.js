const axios = require("axios");
require("dotenv").config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; // Store your API key in .env

const getCoordinates = async (place) => {
    try {
        const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
            params: {
                key: OPENCAGE_API_KEY,
                q: place,
                format: "json"
            }
        });

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { lat, lon: lng };
        } else {
            throw new Error("Location not found");
        }
    } catch (error) {
        console.error("❌ Error fetching coordinates:", error.message);
        throw new Error("Failed to get coordinates");
    }
};

module.exports = { getCoordinates };
