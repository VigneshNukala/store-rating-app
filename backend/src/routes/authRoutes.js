const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { database } = require("../db/db");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
    }

    const existingUser = await database.getUser(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await database.createUser(name, email, hashedPassword, address, role);

    return res
      .status(201)
      .json({ status: "success", message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({
      status: error,
      message: "Internal Server Error. Please try again later.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required.",
    });
  }

  try {
    const user = await database.getUser(email);
    console.log(1);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User doesn't exist",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).send("Invalid password");
    }

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const cookieExpiry = 60 * 60 * 60 * 1000;
    res.cookie("authToken", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: cookieExpiry,
      path: "/",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: error,
      message: "Internal Server Error. Please try again later.",
    });
  }
});

module.exports = authRouter;
