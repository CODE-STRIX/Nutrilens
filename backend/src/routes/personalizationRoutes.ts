import { Router } from 'express';
import { PersonalizationController } from '../controllers/personalizationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// POST /api/personalize - Analyze a product against the authenticated user's profile
router.post('/', authenticateToken, PersonalizationController.analyzeProduct);

// POST /api/personalize/recommend-alternative - Get a healthier alternative for a given product
router.post('/recommend-alternative', authenticateToken, PersonalizationController.recommendAlternative);

// POST /api/personalize/compare - Side-by-side product comparison (Smart Shopping Assistant)
router.post('/compare', authenticateToken, PersonalizationController.compareProducts);

export default router;
