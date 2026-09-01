import { Router } from 'express';
import { PersonalizationController } from '../controllers/personalizationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// POST /api/personalize - Analyze a product against the authenticated user's profile
router.post('/', authenticateToken, PersonalizationController.analyzeProduct);

// Alternative recommendations
router.post('/recommend-alternative', authenticateToken, PersonalizationController.recommendAlternative);
router.post('/alternative', authenticateToken, PersonalizationController.recommendAlternative);
router.get('/alternative/:id', authenticateToken, PersonalizationController.recommendAlternative);
router.get('/recommend/:id', authenticateToken, PersonalizationController.recommendAlternative);

// Product comparison
router.post('/compare', authenticateToken, PersonalizationController.compareProducts);
router.get('/compare', authenticateToken, PersonalizationController.compareProducts);

export default router;
