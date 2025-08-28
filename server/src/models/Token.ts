import db from '../db';
import type { TokenData } from '../interfaces/index';

export const saveRefreshToken = (userId: number, refreshToken: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)',
      [userId, refreshToken],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const findRefreshToken = (refreshToken: string): Promise<TokenData | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT userId, refreshToken FROM tokens WHERE refreshToken = ?',
      [refreshToken],
      (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row ? { userId: row.userId, refreshToken: row.refreshToken } : null);
      }
    );
  });
};

export const updateRefreshToken = (oldToken: string, newToken: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE tokens SET refreshToken = ? WHERE refreshToken = ?',
      [newToken, oldToken],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve((this as any).changes > 0);
      }
    );
  });
};

export const deleteRefreshToken = (refreshToken: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM tokens WHERE refreshToken = ?',
      [refreshToken],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve((this as any).changes > 0);
      }
    );
  });
};