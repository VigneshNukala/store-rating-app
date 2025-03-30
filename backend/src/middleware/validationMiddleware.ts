import { Request, Response, NextFunction } from 'express';
import { error } from '../utils';

export const validateInput = {
  user: (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, address } = req.body;

    // Name: 20-60 characters
    if (name && (name.length < 20 || name.length > 60)) {
      return res.status(400).json(error("Name must be between 20 and 60 characters"));
    }

    // Address: max 400 characters
    if (address && address.length > 400) {
      return res.status(400).json(error("Address must not exceed 400 characters"));
    }

    // Password: 8-16 chars, uppercase, special char
    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json(error("Password must be 8-16 characters with at least one uppercase letter and one special character"));
      }
    }

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json(error("Invalid email format"));
      }
    }

    next();
  }
};