import express, { Request, Response } from "express";
import { database } from "../db/db";
const storeOwnerRouter = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Get ratings for the store owned by the logged-in user
storeOwnerRouter.get("/ratings", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storeId = req.user?.id;
    if (!storeId) {
       res.status(401).json({
        status: "error",
        message: "Unauthorized access",
      });
      return;
    }
    console.log(`Fetching ratings for store: ${storeId}`);

    const result = await database.getRatingByStore(storeId);
    res.status(200).json({
      status: "success",
      message: "Store ratings fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching store ratings:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch store ratings",
      error: (error as Error).message,
    });
  }
});

// Get store average rating
storeOwnerRouter.get("/average-rating", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const storeId = req.user?.id;
    if (!storeId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized access",
      });
      return;
    }
    console.log(`Fetching average rating for store: ${storeId}`);

    const averageRating = await database.getAverageRating(storeId);

    if (!averageRating || averageRating.length === 0) {
      res.status(404).json({
        status: "error",
        message: "No ratings found for this store",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Average rating fetched successfully",
      data: averageRating[0],
    });
  } catch (error) {
    console.error("Error fetching average rating:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch average rating",
      error: (error as Error).message,
    });
  }
});

export default storeOwnerRouter;
