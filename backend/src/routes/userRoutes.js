const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const userRouter = express.Router();

// Rettriving All  Stores
userRouter.get("/stores", async (req, res) => {
  try {
    const stores = await database.getAllStores();
    res.status(200).json({ message: "Retrived all Stores", stores });
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }
});

// Search for Stores by Name or Address
userRouter.get("/stores/search", async (req, res) => {
  try {
    const { name = "", address = "" } = req.query;
    const result = await database.getStore();
    if (result.status === "error") {
      return res.status(500).json(result);
    }
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch Store by name and address",
      error,
    });
  }
});

// Submit a Rating for a Store
userRouter.post("/ratings", authenticateToken, async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;
    console.log(userId);
    await database.submitRating(storeId, rating, userId);
    res
      .status(200)
      .json({ status: "Success", message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to submit rating to the store",
      error,
    });
  }
});

// Modify a Submitted Rating
userRouter.put("/ratings/:storeId", authenticateToken, async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;
    const storeId = req.params.storeId;

    await updateRating(rating, userId, storeId);
    res
      .status(200)
      .json({ status: "Success", message: "Rating updated successfully" });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Failed to update rating to the store",
      error,
    });
  }
});

module.exports = userRouter;
