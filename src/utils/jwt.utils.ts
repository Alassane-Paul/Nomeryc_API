import jwt from 'jsonwebtoken';
import { UserRole } from '../enums/user.enum';

const JWT_SECRET = process.env.JWT_SECRET || 'nomeryc-super-secure-jwt-secret-key-2026';

export interface ITokenPayload {
  userId: string;
  email?: string;
  role?: UserRole;
  type: 'access_token' | 'refresh_token' | 'password_reset' | 'email_verification';
  iat?: number;
  exp?: number;
}

export function generateToken(payload: ITokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any, algorithm: 'HS256' });
}

export function generateAccessToken(userId: string, email: string, role: UserRole): string {
  return generateToken({
    type: 'access_token',
    userId,
    email,
    role,
  }, '7d');
}

export function generateRefreshToken(userId: string): string {
  return generateToken({
    type: 'refresh_token',
    userId,
  }, '30d');
}

export function verifyToken(token: string): ITokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as ITokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyAuthHeader(authHeader?: string): ITokenPayload | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}
