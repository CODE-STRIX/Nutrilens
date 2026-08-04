import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';

export const AnalyticsController = {
  getDashboard: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const dashboard = AnalyticsService.getDashboard(userId);
      return res.json(dashboard);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to load dashboard' });
    }
  },

  getPatterns: (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId || 'usr-demo-rahul';
      const lastN = req.query.lastN ? parseInt(req.query.lastN as string, 10) : 10;
      const patterns = AnalyticsService.getPatterns(userId, lastN);
      return res.json(patterns);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to load pattern intelligence' });
    }
  }
};
