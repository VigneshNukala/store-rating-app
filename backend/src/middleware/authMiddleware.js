const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  try {
    const jwtToken = req.cookies?.authToken;

    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid JWT Token" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key is missing from environment variables");
    }
    const decoded = jwt.verify(jwtToken, secretKey, (error, payload) => {
      if (error) {
        return res.status(401).json({ status: "error", message: error });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const roleMiddleware = (role) => (req, res, next) => {
  if (req.user?.role !== role)
    return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { authenticateToken, roleMiddleware };
