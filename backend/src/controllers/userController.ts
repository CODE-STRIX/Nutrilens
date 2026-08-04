import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';

export const UserController = {
  register: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password, name, age, healthConditions, allergies, goals } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      const result = await UserService.register({
        email,
        password,
        name,
        age,
        healthConditions,
        allergies,
        goals
      });

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Registration failed' });
    }
  },

  login: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await UserService.login({ email, password });
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message || 'Authentication failed' });
    }
  },

  getProfile: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const profile = UserService.getProfile(userId);
      return res.json(profile);
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found' });
    }
  },

  updateProfile: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const updates = req.body;
      const updated = UserService.updateProfile(userId, updates);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to update profile' });
    }
  }
};
