import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { database } from "../db/db";
import { success, error, ApiResponse } from "../utils";
import { authenticateToken } from "../middleware/authMiddleware";

dotenv.config();

const authRouter: Router = express.Router();

const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

const validateUserInput = (fields: any): string | null => {
  const { email, password, name } = fields;
  if (!email || !password) return "Email and password are required.";
  if (name && name.length < 3)
    return "Name must be at least 3 characters long.";
  return null;
};

// **SIGNUP** Route
authRouter.post(
  "/signup",
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const { name, email, password, address, role } = req.body;
      // console.log(req.body);
      const validationError = validateUserInput(req.body);
      if (validationError) {
        res.status(400).json(error(validationError));
        return;
      }

      const existingUser = await database.getUser(email);
      if (existingUser) {
        res.status(409).json(error("User already exists."));
        return;
      }

      const hashedPassword = await hashPassword(password);
      await database.createUser(name, email, hashedPassword, address, role);

      res.status(201).json(success("User registered successfully."));
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json(error("Internal Server Error."));
    }
  }
);

// **SIGNIN** Route
authRouter.post(
  "/signin",
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json(error("Email and password are required."));
        return;
      }

      const user = await database.getUser(email);
      if (!user) {
        res.status(400).json(error("Invalid email or password."));
        return;
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        res.status(400).json(error("Invalid email or password."));
        return;
      }

      const jwtToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("authToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json(
        success<{ token: string; role: string }>({
          token: jwtToken,
          role: user.role,
        })
      );
    } catch (err) {
      console.error("Signin error:", err);
      res.status(500).json(error("Internal Server Error."));
    }
  }
);

// **VERIFY TOKEN** Route
authRouter.get(
  "/verify",
  authenticateToken,
  async (req: Request, res: Response<ApiResponse<string>>) => {
    try {
      const user = (req as any).user;

      // Return a success response with the required structure
      res.status(200).json(
        success<{ isValid: boolean; role: string | undefined }>({
          isValid: true,
          role: user?.role,
        })
      );
      return;
    } catch (err) {
      console.error("Token verification error:", err);
      res.status(500).json(error("Internal Server Error."));
      return;
    }
  }
);

// Logout Route
authRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;
