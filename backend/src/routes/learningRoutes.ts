import { Router } from 'express';
import { LearningController } from '../controllers/learningController';

const router = Router();

// GET /api/learning/lesson?triggers=INS_211,HIGH_SODIUM - Scan-triggered lesson delivery
router.get('/lesson', LearningController.getLessonForScan);

// GET /api/learning/all - Full lesson library
router.get('/all', LearningController.getAllLessons);

// GET /api/learning/:id - Single lesson by ID
router.get('/:id', LearningController.getLessonById);

export default router;
