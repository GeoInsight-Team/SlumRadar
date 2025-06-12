require("dotenv").config();
const axios = require("axios");

const WORLDPOP_API_URL = process.env.WORLDPOP_API_URL || "https://api.worldpop.org/v1/services";
const OVERPASS_API_URL = process.env.OVERPASS_API_URL || "https://overpass-api.de/api/interpreter";

const getPopulation = async (lat, lon) => {
    try {
        const response = await axios.get(`${WORLDPOP_API_URL}/population?latitude=${lat}&longitude=${lon}`);
        const data = response.data;
        
        if (data && data.features && data.features.length > 0) {
            return data.features[0].properties.population;
        }

        return null;
    } catch (error) {
        console.error("❌ Error fetching population data:", error.message);
        return null;
    }
};

const fetchOverpassData = async (query) => {
    try {
        const response = await axios.get(`${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`);
        return response.data.elements.length;
    } catch (error) {
        console.error("❌ Error fetching Overpass data:", error.message);
        return 0;
    }
};

const getHealthcareFacilities = async (lat, lon) => {
    const query = `[out:json];node["amenity"="hospital"](around:5000, ${lat}, ${lon});out count;`;
    return fetchOverpassData(query);
};

const getSchools = async (lat, lon) => {
    const query = `[out:json];node["amenity"="school"](around:5000, ${lat}, ${lon});out count;`;
    return fetchOverpassData(query);
};

const getToilets = async (lat, lon) => {
    const query = `[out:json];node["amenity"="toilets"](around:5000, ${lat}, ${lon});out count;`;
    return fetchOverpassData(query);
};

const getWaterAccessData = async (lat, lon) => {
    const query = `[out:json];node["amenity"="drinking_water"](around:5000, ${lat}, ${lon});out count;`;
    return fetchOverpassData(query);
};

module.exports = { getPopulation, getHealthcareFacilities, getSchools, getToilets, getWaterAccessData };
