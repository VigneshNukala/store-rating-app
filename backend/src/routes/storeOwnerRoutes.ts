import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { database } from "../db/db";
import { ApiResponse, error, success } from "../utils";
import { authenticateToken } from "../middleware/authMiddleware";

const storeOwnerRouter = express.Router();
storeOwnerRouter.use(authenticateToken);

const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// UPDATE PASSWORD Route
storeOwnerRouter.post(
  "/update-password",
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const { email, currentPassword, newPassword } = req.body;

      if (!email || !currentPassword || !newPassword) {
        res
          .status(400)
          .json(
            error("Email, current password, and new password are required.")
          );
        return;
      }

      const user = await database.getUser(email);
      if (!user) {
        res.status(404).json(error("User not found."));
        return;
      }

      const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatched) {
        res.status(400).json(error("Current password is incorrect."));
        return;
      }

      const hashedPassword = await hashPassword(newPassword);
      await database.updateUserPassword(email, hashedPassword);

      res.status(200).json(success("Password updated successfully."));
    } catch (err) {
      console.error("Update password error:", err);
      res.status(500).json(error("Internal Server Error."));
    }
  }
);

// Get ratings and users for the store owned by the logged-in user
storeOwnerRouter.get(
  "/ratings",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const storeId = req.user?.id;
      if (!storeId) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized access",
        });
        return;
      }
      console.log(`Fetching ratings and users for store: ${storeId}`);

      const result = await database.getRatingsByStoreWithUsers(storeId);
      res.status(200).json({
        status: "success",
        message: "Store ratings and users fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching store ratings and users:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch store ratings and users",
        error: (error as Error).message,
      });
    }
  }
);

// Get store average ratings for the logged-in user
storeOwnerRouter.get(
  "/average-rating",
  async (req: AuthenticatedRequest, res: Response) => {
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
      console.log("Average rating:", averageRating);
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
  }
);

export default storeOwnerRouter;
