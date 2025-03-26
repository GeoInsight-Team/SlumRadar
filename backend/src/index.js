const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const authRoutes = require("./controllers/authController");
const { getCoordinates } = require("./services/geoService");
const slumRoutes = require("./routes/slumRoutes");
const userRoutes = require("./routes/userRoutes");
const mlRoutes = require('./routes/mlRoutes');
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use('/api/ml', mlRoutes);
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.use("/api/slums", slumRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Slum Detection API is running!" });
});
 
// const { getAdditionalData } = require("./services/dataService");  
const { getPopulation, getHealthcareFacilities, getSchools, getToilets, getWaterAccessData } = require("./services/resourceService");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/test/:place", async (req, res) => {
    const place = req.params.place;

    try {
        // Step 1: Get Latitude & Longitude
        const { lat, lon } = await getCoordinates(place);
        console.log("📍 Requested Place:", place);
        console.log("🌍 Coordinates:", { lat, lon });

        // Step 2: Fetch Additional Data Using These Coordinates
        // const additionalData = await getAdditionalData(lat, lon);
        // console.log("📊 Additional Data:", additionalData);

        // Step 3: Fetch Population & Resource Data
        const population = await getPopulation(lat, lon);
        const hospitals = await getHealthcareFacilities(lat, lon);
        const schools = await getSchools(lat, lon);
        const toilets = await getToilets(lat, lon);
        const waterSources = await getWaterAccessData(lat, lon);

        console.log("🏥 Hospitals:", hospitals);
        console.log("🏫 Schools:", schools);
        console.log("🚻 Toilets:", toilets);
        console.log("💧 Water Sources:", waterSources);
        console.log("👥 Population:", population);

        // Step 4: Send Full Response
        res.json({
            success: true,
            place,
            coordinates: { lat, lon },
            resources: {
                population,
                hospitals,
                schools,
                toilets,
                waterSources
            }
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
