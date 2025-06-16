import { User } from './types';

export const hashPassword = (password: string): string => {
  // Simple hash for demo purposes - use bcrypt in production
  return Buffer.from(password).toString('base64');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const generateClassCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};