import express from 'express';
import jwt from 'jsonwebtoken';
import { findRefreshToken, updateRefreshToken, deleteRefreshToken } from '../models/Token';
import { findUserById } from '../models/User';
import type { DecodedToken } from '../interfaces/index';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config';

const router = express.Router();

router.post('/', async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== 'string') {
      return res.status(400).json({ error: 'Valid refresh token required' });
    }

    const tokenData = await findRefreshToken(refreshToken);
    
    if (!tokenData) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as DecodedToken;    
    const user = await findUserById(decoded.userId);
    if (!user) {
      await deleteRefreshToken(refreshToken);
      return res.status(403).json({ error: 'User not found' });
    }
    
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    const updated = await updateRefreshToken(refreshToken, newRefreshToken);
    
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update token' });
    }
    
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;