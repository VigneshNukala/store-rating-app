import express, { Request, Response } from "express";
import { database } from "../db/db";
import { success, error, ApiResponse } from "../utils";
import { AuthRequest } from "../middleware/authMiddleware";

const userRouter = express.Router();

// Get list of all stores with search
userRouter.get("/stores", async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    console.log("Hi");
    const { name, address } = req.query;
    const filters = {
      name: name as string,
      address: address as string
    };

    const stores = await database.getAllStores(filters);
    res.status(200).json(success(stores));
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json(error("Failed to retrieve stores"));
  }
});

// Get store details by ID
userRouter.get("/stores/:id", async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const storeId = parseInt(req.params.id);
    const store = await database.getStore(storeId);

    if (!store) {
      res.status(404).json(error("Store not found"));
      return;
    }

    res.status(200).json(success(store));
  } catch (err) {
    console.error("Error fetching store:", err);
    res.status(500).json(error("Failed to retrieve store details"));
  }
});

// Submit a rating
userRouter.post("/rating", async (req: AuthRequest, res: Response<ApiResponse<string>>) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user?.id;

    if (!storeId || !rating || !userId) {
      res.status(400).json(error("Store ID, rating, and user authentication are required"));
      return
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json(error("Rating must be between 1 and 5"));
      return;
    }

    await database.submitRating(storeId, rating, userId);
    res.status(201).json(success("Rating submitted successfully"));
  } catch (err) {
    console.error("Rating submission error:", err);
    res.status(500).json(error("Failed to submit rating"));
  }
});

// Update existing rating
userRouter.post("/rating/:id", async (req: AuthRequest, res: Response<ApiResponse<string>>) => {
  try {
    const ratingId = parseInt(req.params.id);
    const { rating } = req.body;
    const userId = req.user?.id;

    if (!rating || !userId) {
      res.status(400).json(error("Rating and user authentication are required"));
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json(error("Rating must be between 1 and 5"));
      return;
    }

    // Verify rating ownership
    const existingRating = await database.getRatingById(ratingId);
    if (!existingRating) {
      res.status(404).json(error("Rating not found"));
      return; 
    }

    if (existingRating.user_id !== userId) {
      res.status(403).json(error("Not authorized to update this rating"));
      return;
    }

    await database.updateRating(existingRating.store_id, rating, userId);
    res.status(200).json(success("Rating updated successfully"));
  } catch (err) {
    console.error("Rating update error:", err);
    res.status(500).json(error("Failed to update rating"));
  }
});

// Get all ratings for a store
userRouter.get("/ratings/store/:storeId", async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const storeId = req.params.storeId;
    const ratings = await database.getRatingByStore(storeId);

    if (!ratings || ratings.length === 0) {
      res.status(404).json(error("No ratings found for this store"));
      return;
    }

    res.status(200).json(success(ratings));
  } catch (err) {
    console.error("Error fetching store ratings:", err);
    res.status(500).json(error("Failed to fetch store ratings"));
  }
});

// Get all ratings by a user
userRouter.get("/ratings/user/:userId", async (req: Request, res: Response<ApiResponse<any>>) => {
  try {
    const userId = parseInt(req.params.userId);
    const ratings = await database.getUserRatings(userId);

    if (!ratings || ratings.length === 0) {
      res.status(404).json(error("No ratings found for this user"));
      return;
    }

    res.status(200).json(success(ratings));
  } catch (err) {
    console.error("Error fetching user ratings:", err);
    res.status(500).json(error("Failed to fetch user ratings"));
  }
});

export default userRouter;
