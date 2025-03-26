const tf = require('@tensorflow/tfjs');
const path = require("path");
const fs = require("fs");

// Load model once and reuse for efficiency
let model;

/**
 * Load the trained ML model from file.
 */
const loadModel = async () => {
    try {
        if (!model) {
            const modelPath = path.join(__dirname, "../mlModel/model.json");
            model = await tf.loadLayersModel(`file://${modelPath}`);
            console.log("✅ ML Model loaded successfully");
        }
        return model;
    } catch (error) {
        console.error("❌ Error loading ML model:", error.message);
        throw new Error("Failed to load ML model");
    }
};

/**
 * Preprocess input data for the model.
 * @param {object} data - Input data (population, hospitals, schools, resources).
 * @returns {tf.Tensor} - Preprocessed data tensor.
 */
const preprocessData = (data) => {
    const { population, hospitals, schools, resources } = data;

    // Convert categorical 'resources' field into numerical values
    const resourceMapping = { "High": 2, "Medium": 1, "Low": 0, "Unknown": -1 };
    const resourceValue = resourceMapping[resources] || -1;

    // Normalize values (example: assuming max values for normalization)
    const maxPopulation = 1000000;
    const maxHospitals = 100;
    const maxSchools = 200;

    const normalizedData = [
        population / maxPopulation,
        hospitals / maxHospitals,
        schools / maxSchools,
        resourceValue / 2  // Normalized between -0.5 to 1
    ];

    return tf.tensor2d([normalizedData]);
};

/**
 * Predict if a location is a slum and if it may have resource shortages in the future.
 * @param {object} data - Input data for prediction.
 * @returns {Promise<object>} - Prediction result.
 */
const predictSlumArea = async (data) => {
    try {
        const model = await loadModel();
        const inputTensor = preprocessData(data);

        // Make prediction
        const prediction = model.predict(inputTensor);
        const output = await prediction.data();  // Convert tensor to array

        return {
            isSlum: output[0] > 0.5,  // Threshold for classification
            futureShortageRisk: output[1] > 0.5  // Threshold for future shortage risk
        };
    } catch (error) {
        console.error("❌ Error making prediction:", error.message);
        throw new Error("Failed to make a prediction");
    }
};

module.exports = {
    predictSlumArea,
};
