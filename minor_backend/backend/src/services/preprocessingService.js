const _ = require("lodash");

/**
 * Cleans and validates incoming slum data.
 * @param {object} data - Raw input data from APIs.
 * @returns {object|null} - Cleaned and structured data, or null if invalid.
 */
const cleanData = (data) => {
    if (!data || typeof data !== "object") {
        console.error("❌ Invalid data received for preprocessing.");
        return null;
    }

    const cleanedData = {
        place: data.place || "Unknown",
        population: parseInt(data.population, 10) || 0,
        hospitals: parseInt(data.hospitals, 10) || 0,
        schools: parseInt(data.schools, 10) || 0,
        resources: data.resources ? data.resources.toLowerCase() : "unknown"
    };

    return cleanedData;
};

/**
 * Normalizes numerical values to a consistent scale.
 * @param {object} data - Cleaned data.
 * @returns {object} - Normalized data.
 */
const normalizeData = (data) => {
    const maxPopulation = 1000000;
    const maxHospitals = 100;
    const maxSchools = 200;

    return {
        place: data.place,
        population: data.population / maxPopulation,
        hospitals: data.hospitals / maxHospitals,
        schools: data.schools / maxSchools,
        resources: mapResourceLevel(data.resources)
    };
};

/**
 * Converts resource level categories into numerical values.
 * @param {string} level - Resource level (e.g., "high", "medium", "low").
 * @returns {number} - Mapped numerical value.
 */
const mapResourceLevel = (level) => {
    const levels = { "high": 2, "medium": 1, "low": 0, "unknown": -1 };
    return levels[level] || -1;
};

/**
 * Prepares raw API data for ML processing.
 * @param {object} rawData - Data collected from APIs.
 * @returns {object|null} - Fully preprocessed data or null if invalid.
 */
const preprocessData = (rawData) => {
    const cleanedData = cleanData(rawData);
    if (!cleanedData) return null;

    return normalizeData(cleanedData);
};

module.exports = {
    preprocessData,
};
