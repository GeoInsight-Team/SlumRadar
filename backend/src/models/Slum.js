const mongoose = require("mongoose");

/**
 * Slum Schema - Defines the structure of slum data stored in MongoDB.
 */
const SlumSchema = new mongoose.Schema({
    place: {
        type: String,
        required: true,
        unique: true, // Ensures a place is not duplicated
        trim: true
    },
    population: {
        type: Number,
        required: true,
        min: 0
    },
    hospitals: {
        type: Number,
        required: true,
        min: 0
    },
    schools: {
        type: Number,
        required: true,
        min: 0
    },
    resources: {
        type: String,
        enum: ["high", "medium", "low", "unknown"],
        default: "unknown"
    },
    needsAssistance: {
        type: Boolean,
        default: false
    },
    futureShortageRisk: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

/**
 * Create and export the Slum model.
 */
const Slum = mongoose.model("Slum", SlumSchema);
module.exports = Slum;
