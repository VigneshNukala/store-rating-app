import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { database } from "../db/db.js";
import { success, error, ApiResponse } from "../utils.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();

const adminRouter: Router = express.Router();

adminRouter.use(authenticateToken);

// Get users with filters
adminRouter.get(
  "/users",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, email, role } = req.query;
      const filters = {
        name: name as string,
        email: email as string,
        role: role as string,
      };

      const users = await database.getAllUsers(filters);
      res.status(200).json(success(users));
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json(error("Failed to fetch users"));
    }
  }
);

// **UPDATE USER ROLE** (Admin-only)
adminRouter.post(
  "/update-role",
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const { email, newRole } = req.body;

      if (!email || !newRole) {
        res.status(400).json(error("Email and new role are required."));
        return;
      }

      const user = await database.getUser(email);
      if (!user) {
        res.status(404).json(error("User not found."));
        return;
      }

      await database.updateUserRole(email, newRole);
      res.status(200).json(success("User role updated successfully."));
    } catch (err) {
      console.error("Update role error:", err);
      res.status(500).json(error("Internal Server Error."));
    }
  }
);

// **DELETE USER** (Admin-only)
adminRouter.post(
  "/delete-user",
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json(error("Email is required."));
        return;
      }

      const user = await database.getUser(email);
      if (!user) {
        res.status(404).json(error("User not found."));
        return;
      }

      await database.deleteUser(email);
      res.status(200).json(success("User deleted successfully."));
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json(error("Internal Server Error."));
    }
  }
);

// Get dashboard stats
adminRouter.get(
  "/stats",
  async (_req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const users = await database.getAllUsers();
      const stores = await database.getAllStores();
      const ratings = await database.getAllRatings();

      const stats = {
        totalUsers: users.length,
        totalStores: stores.length,
        totalRatings: ratings.length,
        averageRating:
          ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) /
              ratings.length
            : 0,
      };

      res.status(200).json(success(stats));
    } catch (err) {
      console.error("stats error:", err);
      res.status(500).json(error("Failed to fetch statistics"));
    }
  }
);

// Create new user
adminRouter.post(
  "/user",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, email, password, role, address } = req.body;

      if (!name || !email || !password || !role) {
        res.status(400).json(error("Missing required fields"));
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await database.createUser(
        name,
        email,
        hashedPassword,
        address || null,
        role
      );

      res.status(201).json(success("User created successfully"));
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json(error("Failed to create user"));
    }
  }
);

// Get specific user
adminRouter.get(
  "/user/:id",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await database.getUserById(userId);

      if (!user) {
        res.status(404).json(error("User not found"));
        return;
      }

      res.status(200).json(success(user));
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json(error("Failed to fetch user"));
    }
  }
);

// Get stores with filters
adminRouter.get(
  "/stores",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, address } = req.query;
      const filters = {
        name: name as string,
        address: address as string,
      };

      const stores = await database.getAllStores(filters);
      res.status(200).json(success(stores));
    } catch (err) {
      console.error("Get stores error:", err);
      res.status(500).json(error("Failed to fetch stores"));
    }
  }
);

// Get specific store
adminRouter.get(
  "/stores/:id",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await database.getStore(storeId);

      if (!store) {
        res.status(404).json(error("Store not found"));
        return;
      }

      res.status(200).json(success(store));
    } catch (err) {
      console.error("Get store error:", err);
      res.status(500).json(error("Failed to fetch store"));
    }
  }
);

// Add a new store
adminRouter.post(
  "/add-store",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, address, email } = req.body;

      if (!name || !address || !email) {
        res.status(400).json(error("Missing required fields"));
        return;
      }

      const owner = await database.getUser(email);
      if (!owner) {
        res.status(404).json(error("Owner not found"));
        return;
      }

      await database.createStore(name, address, email);
      res.status(201).json(success("Store added successfully"));
    } catch (err) {
      console.error("Add store error:", err);
      res.status(500).json(error("Failed to add store"));
    }
  }
);

export default adminRouter;
