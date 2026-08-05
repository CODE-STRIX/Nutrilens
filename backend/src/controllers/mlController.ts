import { Request, Response } from 'express';
import { ocrIngredientParser } from '../ml/ocrIngredientParser';
import { healthRankingModel } from '../ml/healthRankingModel';
import { alternativeRecommender } from '../ml/alternativeRecommender';
import { patternAnalyticsModel, UserScanRecord } from '../ml/patternAnalyticsModel';
import { Product } from '../../../shared/types/product';
import { UserProfile } from '../../../shared/types/user';

export const mlController = {
  // Model 1 & 2: Parse OCR text & normalize entities
  parseOcrText: (req: Request, res: Response): void => {
    try {
      const { ocrText } = req.body;
      if (!ocrText) {
        res.status(400).json({ success: false, error: 'ocrText field is required' });
        return;
      }

      const result = ocrIngredientParser.parseLabelText(ocrText);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Model 3: Personalized Health Ranking Engine
  rankHealthRisk: (req: Request, res: Response): void => {
    try {
      const { product, user } = req.body as { product: Product; user: UserProfile };
      if (!product || !user) {
        res.status(400).json({ success: false, error: 'Both product and user objects are required' });
        return;
      }

      const result = healthRankingModel.evaluateProductForUser(product, user);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Model 4: Vector Alternative Recommendation Engine
  recommendAlternative: (req: Request, res: Response): void => {
    try {
      const { product, user } = req.body as { product: Product; user: UserProfile };
      if (!product || !user) {
        res.status(400).json({ success: false, error: 'Both product and user objects are required' });
        return;
      }

      const recommendation = alternativeRecommender.recommendAlternative(product, user);
      res.json({ success: true, data: recommendation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Model 5: Food Pattern Intelligence & Anomaly Detection
  analyzePatternAnomalies: (req: Request, res: Response): void => {
    try {
      const { userId, scanHistory } = req.body as { userId: string; scanHistory: UserScanRecord[] };
      if (!userId || !scanHistory) {
        res.status(400).json({ success: false, error: 'userId and scanHistory array are required' });
        return;
      }

      const result = patternAnalyticsModel.analyzePatternAnomalies(userId, scanHistory);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
