import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  email: string;
  role: 'admin' | 'owner' | 'user';
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const isStoreOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Store owner access required' });
  }
  next();
};

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'User access required' });
  }
  next();
};