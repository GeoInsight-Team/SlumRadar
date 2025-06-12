require("dotenv").config();

/**
 * Database configuration for MongoDB and MySQL
 */
const dbConfig = {
    mongoURI: process.env.MONGO_URI,  // MongoDB connection string

    mysql: {
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "slum_project",
        dialect: "mysql",
        port: process.env.MYSQL_PORT || 3306,
    }
};

module.exports = dbConfig;
