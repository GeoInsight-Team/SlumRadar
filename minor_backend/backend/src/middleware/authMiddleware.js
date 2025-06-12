const jwt = require("jsonwebtoken");

// Middleware to authenticate users using JWT
exports.verifyToken  = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Handle 'Bearer <token>' format
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");

        // Attach user data to request object
        req.user = decoded;
        next(); // Continue to the next middleware or route handler

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token." });
        } else {
            return res.status(500).json({ message: "Internal server error." });
        }
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
