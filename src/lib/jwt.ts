/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signJWT = (payload: any, options?: jwt.SignOptions) => {
  return jwt.sign(payload, JWT_SECRET, {
    ...(options && options),
    expiresIn: '7d', 
  });
};

export const verifyJWT = <T>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};