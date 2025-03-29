const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  try {
    const jwtToken = req.cookies?.authToken;
    console.log(jwtToken);

    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid JWT Token" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key is missing from environment variables");
    }
    jwt.verify(jwtToken, secretKey, (error, payload) => {
      if (error) {
        return res.status(401).json({ status: "error", message: error });
      }
      req.user = payload;
      next();
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { authenticateToken };
