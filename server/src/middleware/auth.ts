import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest, DecodedToken } from '../interfaces/index';
import { JWT_SECRET } from '../config';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) return res.status(401).json({ error: 'Invalid token' });

  const payload = decoded as DecodedToken;
  if (!payload.userId || !payload.username) {
    return res.status(401).json({ error: 'Invalid token payload' });
  }

  req.user = { userId: payload.userId, username: payload.username };
  next();
});

};