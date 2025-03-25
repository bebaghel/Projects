import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Middleware to verify JWT token
export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to check admin role
export const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
};

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    // console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    // console.log("Token Extracted:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};


// module.exports = authMiddleware;
