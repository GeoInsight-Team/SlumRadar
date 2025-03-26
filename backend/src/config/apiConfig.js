require("dotenv").config();

/**
 * API Configuration for external data sources
 */
const apiConfig = {
    externalAPIs: {
        populationData: {
            baseUrl: process.env.POPULATION_API_URL || "https://api.population.io",
            apiKey: process.env.POPULATION_API_KEY || "", // If required
        },
        healthcareData: {
            baseUrl: process.env.HEALTHCARE_API_URL || "https://healthcare-data.com/api",
            apiKey: process.env.HEALTHCARE_API_KEY || "",
        },
        educationData: {
            baseUrl: process.env.EDUCATION_API_URL || "https://education-data.org/api",
            apiKey: process.env.EDUCATION_API_KEY || "",
        },
        infrastructureData: {
            baseUrl: process.env.INFRASTRUCTURE_API_URL || "https://infra-data.net/api",
            apiKey: process.env.INFRASTRUCTURE_API_KEY || "",
        }
    },

    requestOptions: {
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Slum-Detection-Service",
        },
        timeout: 5000, // 5 seconds timeout for API requests
    }
};

module.exports = apiConfig;
