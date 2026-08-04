import { Request, Response } from 'express';
import { recallService } from '../services/recall/recallService';

export class RecallController {
  public getAllNotices = async (_req: Request, res: Response): Promise<void> => {
    try {
      const notices = recallService.getAllRecallNotices();
      res.json({ success: true, count: notices.length, data: notices });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getUserAlerts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_default';
      const alerts = recallService.getUserAlerts(userId);
      res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public triggerRecallCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_default';
      const alerts = recallService.checkRetroactiveRecallsForUser(userId);
      res.json({ success: true, message: "Retroactive recall check complete", count: alerts.length, data: alerts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public markAlertRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { alertId } = req.params;
      const success = recallService.markAlertAsRead(alertId);
      if (!success) {
        res.status(404).json({ success: false, message: `Alert ${alertId} not found` });
        return;
      }
      res.json({ success: true, message: `Alert ${alertId} marked as read` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}

export const recallController = new RecallController();
