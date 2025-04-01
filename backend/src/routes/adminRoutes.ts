import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { database } from "../db/db";
import { success, error, ApiResponse } from "../utils";
import { authenticateToken } from "../middleware/authMiddleware";

dotenv.config();

const adminRouter: Router = express.Router();

adminRouter.use(authenticateToken);

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

      await database.createStore(name, email, address);
      res.status(201).json(success("Store added successfully"));
    } catch (err) {
      console.error("Add store error:", err);
      res.status(500).json(error("Failed to add store"));
    }
  }
);

// Create new user
adminRouter.post(
  "/user",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, email, password, role, address } = req.body;
      console.log(req.body);
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

// Get stats
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

// Get users with filters
adminRouter.get(
  "/users",
  async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
      const { name, email, role } = req.query;

      // Fetch users with optional filters
      const filters = {
        name: name as string,
        email: email as string,
        role: role as string,
      };
      const users = await database.getAllUsers(filters);

      // Fetch all stores and ratings
      const stores = await database.getAllStores();
      const ratings = await database.getAllRatings();

      // Map users and include ratings for store owners
      const usersWithRatings = users.map((user) => {
        if ((user.role as string) === "owner") {
          // Get stores owned by the user
          const ownerStores = stores.filter(
            (store) => store.ownerEmail === user.email
          );

          // Calculate ratings for each store
          const storesWithRatings = ownerStores.map((store) => {
            const storeRatings = ratings.filter(
              (rating) => rating.storeId === store.id
            );

            const averageRating =
              storeRatings.length > 0
                ? storeRatings.reduce((acc, curr) => acc + curr.rating, 0) /
                  storeRatings.length
                : 0;

            return {
              id: store.id,
              name: store.name,
              address: store.address,
              averageRating: Number(averageRating.toFixed(1)),
              totalRatings: storeRatings.length,
            };
          });

          // Calculate overall rating for the store owner
          const totalRatings = storesWithRatings.reduce(
            (acc, store) => acc + store.totalRatings,
            0
          );
          const overallAverageRating =
            totalRatings > 0
              ? storesWithRatings.reduce(
                  (acc, store) =>
                    acc + store.averageRating * store.totalRatings,
                  0
                ) / totalRatings
              : 0;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            overallAverageRating: Number(overallAverageRating.toFixed(1)),
            totalRatings,
            stores: storesWithRatings,
          };
        } else {
          // For non-owners, return basic user details
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
          };
        }
      });

      res.status(200).json(success(usersWithRatings));
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json(error("Failed to fetch users"));
    }
  }
);

// Get store owners with ratings
adminRouter.get(
  "/store-owners",
  async (_req: Request, res: Response<ApiResponse<any>>) => {
    try {
      console.log("HIT");
      const users = await database.getAllUsers({ role: "owner" });
      // console.log(users);
      const stores = await database.getAllStores();
      const ratings = await database.getAllRatings();

      const storeOwners = users.map((owner) => {
        const ownerStores = stores.filter(
          (store) => store.ownerEmail === owner.email
        );
        const storeRatings = ownerStores.map((store) => {
          const storeRating = ratings.filter(
            (rating) => rating.storeId === store.id
          );
          const averageRating =
            storeRating.length > 0
              ? storeRating.reduce((acc, curr) => acc + curr.rating, 0) /
                storeRating.length
              : 0;
          return {
            ...store,
            averageRating: Number(averageRating.toFixed(1)),
          };
        });

        return {
          ...owner,
          stores: storeRatings,
        };
      });

      res.status(200).json(success(storeOwners));
    } catch (err) {
      console.error("Get store owners error:", err);
      res.status(500).json(error("Failed to fetch store owners"));
    }
  }
);

export default adminRouter;
