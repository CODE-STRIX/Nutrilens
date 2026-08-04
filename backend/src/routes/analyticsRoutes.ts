import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// GET /api/dashboard - Progress dashboard: running score, streaks, recent scans
router.get('/', authenticateToken, AnalyticsController.getDashboard);

// GET /api/dashboard/patterns?lastN=10 - Eating pattern intelligence
router.get('/patterns', authenticateToken, AnalyticsController.getPatterns);

export default router;
