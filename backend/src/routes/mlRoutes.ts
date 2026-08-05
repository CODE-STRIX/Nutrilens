import { Router } from 'express';
import { mlController } from '../controllers/mlController';

const router = Router();

// POST /api/ml/parse-ocr - Parse OCR text & normalize INS additives
router.post('/parse-ocr', mlController.parseOcrText);

// POST /api/ml/rank-health - Personalized Health Ranking Engine
router.post('/rank-health', mlController.rankHealthRisk);

// POST /api/ml/recommend - Vector Space Alternative Recommender
router.post('/recommend', mlController.recommendAlternative);

// POST /api/ml/pattern-anomalies - Time-Series Pattern Anomaly Detector
router.post('/pattern-anomalies', mlController.analyzePatternAnomalies);

export default router;
