import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../../../shared/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'nutri_lens_sih_2026_codestrix_secret_key_super_secure';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For easy API testing in SIH demo, if no token provided, fallback to demo user 'usr-demo-rahul'
    req.user = { userId: 'usr-demo-rahul', email: 'rahul.sharma@example.com' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
