import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: number;
  role?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtToken = req.cookies?.authToken;
    console.log(jwtToken);

    if (!jwtToken) {
      res
        .status(401)
        .json({ status: "error", message: "Invalid JWT Token" });
      return;
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key is missing from environment variables");
    }

    jwt.verify(jwtToken, secretKey, (error: jwt.VerifyErrors | null, payload: any) => {
      if (error) {
        res.status(401).json({ status: "error", message: error });
        return;
      }
      req.user = payload as JwtPayload;
      next();
    });
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ 
      status: "error", 
      message: (error as Error).message 
    });
  }
};

export { authenticateToken, AuthRequest };