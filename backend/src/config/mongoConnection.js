const mongoose = require("mongoose");
const dbConfig = require("../dbConfig");

const connectMongoDB = async () => {
    try {
        await mongoose.connect(dbConfig.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
