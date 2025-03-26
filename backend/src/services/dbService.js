// const mongoose = require("mongoose");
// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// /**
//  * Connect to MongoDB
//  */
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("✅ MongoDB connected successfully");
//     } catch (error) {
//         console.error("❌ MongoDB connection error:", error);
//         process.exit(1); // Exit process on failure
//     }
// };

/**
 * Initialize Sequelize for SQL database
 */
// const sequelize = new Sequelize(
//     process.env.SQL_DATABASE,
//     process.env.SQL_USER,
//     process.env.SQL_PASSWORD,
//     {
//         host: process.env.SQL_HOST,
//         dialect: process.env.SQL_DIALECT || "mysql",
//         port: process.env.SQL_PORT || 3306,
//         logging: false, // Set to true to enable SQL query logging
//     }
// );

// /**
//  * Connect to SQL Database
//  */
// const connectSQLDB = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("✅ SQL Database Connected Successfully");
//     } catch (error) {
//         console.error("❌ SQL Database Connection Error:", error);
//         process.exit(1); // Exit process if connection fails
//     }
// };

module.exports = { connectDB };
