import { Request, Response } from 'express';
import { LearningService } from '../services/learningService';

export const LearningController = {
  /**
   * GET /api/learning/lesson?triggers=INS_211,HIGH_SODIUM
   * Returns a lesson relevant to the recent scan context.
   * The 'triggers' query param is a comma-separated list of INS codes or nutrient flags.
   */
  getLessonForScan: (req: Request, res: Response) => {
    try {
      const triggerParam = req.query.triggers as string | undefined;
      const triggerKeys = triggerParam ? triggerParam.split(',').map(t => t.trim()) : [];
      const lesson = LearningService.getLessonForScan(triggerKeys);
      return res.json(lesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch lesson' });
    }
  },

  /**
   * GET /api/learning/all
   * Returns the full learning library (all available lessons).
   */
  getAllLessons: (_req: Request, res: Response) => {
    try {
      const lessons = LearningService.getAllLessons();
      return res.json(lessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch lessons' });
    }
  },

  /**
   * GET /api/learning/:id
   * Returns a single lesson by ID.
   */
  getLessonById: (req: Request, res: Response) => {
    try {
      const lesson = LearningService.getLessonById(req.params.id);
      if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
      return res.json(lesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch lesson' });
    }
  }
};
