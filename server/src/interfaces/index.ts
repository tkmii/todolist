import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export interface TokenData {
  userId: number;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface DecodedToken {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface TokenPayload {
  userId: number;
  username: string;
}
