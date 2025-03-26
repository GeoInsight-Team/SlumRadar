require("dotenv").config();

/**
 * Machine Learning Model Configuration
 */
const mlConfig = {
    modelPath: process.env.ML_MODEL_PATH || "./models/slum_detection_model.pkl",
    
    // API Endpoint (if model is hosted separately)
    modelAPI: process.env.ML_MODEL_API || "http://localhost:5000/predict",

    // Preprocessing Parameters
    preprocessing: {
        normalize: true, // Enable/Disable data normalization
        featureScaling: "min-max", // Options: "standard", "min-max"
    },

    // Inference Settings
    inference: {
        confidenceThreshold: 0.75, // Minimum confidence score for predictions
        batchSize: 1, // Number of inputs processed at once
        responseFormat: "json", // Options: "json", "csv"
    },

    // Logging Settings
    logging: {
        enable: true, // Enable logging of model predictions
        logLevel: "info", // Options: "debug", "info", "warn", "error"
    }
};

module.exports = mlConfig;
