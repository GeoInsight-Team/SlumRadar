const { Sequelize } = require("sequelize");
const dbConfig = require("../dbConfig");

// Initialize Sequelize instance
const sequelize = new Sequelize(
    dbConfig.mysql.database,
    dbConfig.mysql.user,
    dbConfig.mysql.password,
    {
        host: dbConfig.mysql.host,
        dialect: dbConfig.mysql.dialect,
        port: dbConfig.mysql.port,
        logging: false, // Set to true for SQL logs
    }
);

// Test MySQL connection
const testMySQLConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ MySQL Database Connected Successfully!");
    } catch (error) {
        console.error("❌ MySQL Connection Error:", error);
    }
};

module.exports = { sequelize, testMySQLConnection };
