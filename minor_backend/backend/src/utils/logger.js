const winston = require("winston");
require("dotenv").config();

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Create Winston logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info", // Log level (debug, info, warn, error)
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // ✅ Fix applied
                logFormat
            ),
        }),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

// Middleware for Express logging
const loggerMiddleware = (req, res, next) => {
    logger.info(`📡 ${req.method} ${req.url} - ${req.ip}`);
    next();
};

// ✅ Export correctly
module.exports = logger;
module.exports.loggerMiddleware = loggerMiddleware;
