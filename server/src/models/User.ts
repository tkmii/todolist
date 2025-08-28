import db from '../db';
import bcrypt from 'bcryptjs';
import type { User } from '../interfaces/index';

export const createUser = (username: string, passwordHash: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
      [username, passwordHash],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

export const findUserByUsername = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row: User) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const findUserById = (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username FROM users WHERE id = ?',
      [id],
      (err, row: User | undefined) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};