const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../models/user");
const logger = require("../utils/logger");

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // 1️⃣ Check header
    if (!authHeader) {
      return res.status(401).json({ error: "Access token required" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // 3️⃣ Verify token
    const decoded = verifyToken(token);

    // 4️⃣ Find user
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.critical("Authentication error:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to optionally authenticate tokens (for endpoints that work with/without auth)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    next(); // ignore errors
  }
};


module.exports = {
	authenticateToken,
	optionalAuth,
};
