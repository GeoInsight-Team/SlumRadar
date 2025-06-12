const crypto = require("crypto");

/**
 * Generate a unique identifier (UUID)
 * @returns {string} - Randomly generated UUID
 */
const generateUUID = () => {
    return crypto.randomUUID();
};

/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Validate if an input is a valid email.
 * @param {string} email - Input email address
 * @returns {boolean} - True if valid, otherwise false
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate if an input is a valid number.
 * @param {string|number} value - Input value
 * @returns {boolean} - True if valid, otherwise false
 */
const isValidNumber = (value) => {
    return !isNaN(value) && isFinite(value);
};

/**
 * Format a date to `YYYY-MM-DD HH:mm:ss`
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
const formatDateTime = (date = new Date()) => {
    return date.toISOString().replace("T", " ").substring(0, 19);
};

/**
 * Sleep function (to pause execution for a given time)
 * @param {number} ms - Time in milliseconds
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate a random integer between a given range.
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number within the range
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Check if an object is empty.
 * @param {object} obj - Object to check
 * @returns {boolean} - True if empty, otherwise false
 */
const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

/**
 * Deep clone an object to avoid reference issues.
 * @param {object} obj - Object to clone
 * @returns {object} - Deep copied object
 */
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove extra whitespace from a string.
 * @param {string} str - Input string
 * @returns {string} - Trimmed string
 */
const trimString = (str) => {
    return str.replace(/\s+/g, " ").trim();
};

module.exports = {
    generateUUID,
    capitalizeWords,
    isValidEmail,
    isValidNumber,
    formatDateTime,
    sleep,
    getRandomInt,
    isEmptyObject,
    deepClone,
    trimString,
};
