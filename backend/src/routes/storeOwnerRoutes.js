const express = require("express");

const database = require("../db/db");

const authorizeRoles = require("../middleware/roleMiddleware");

const storeOwnerRouter = express.Router();

storeOwnerRouter.use(authorizeRoles("Store Owner"));

// Get ratings for the store owned by the logged-in user
storeOwnerRouter.get("/ratings", async (req, res) => {
  try {
    const storeId = req.user.id;
    const result = await database.getRatingByStore(storeId);
    res
      .status(200)
      .json({
        status: "Success",
        message: "Rating of Store owner Fetched",
        data: result,
      });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to Fetch Rating of Store owner",
      error,
    });
  }
});

// Get store average rating
storeOwnerRouter.get("/average-rating", (req, res) => {
  const storeId = req.user.id;

  db.query(
    "SELECT AVG(rating) AS averageRating FROM ratings WHERE store_id = ?",
    [storeId],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(result[0]);
    }
  );
});

module.exports = storeOwnerRouter;
