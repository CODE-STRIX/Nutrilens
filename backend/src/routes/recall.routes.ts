import { Router } from 'express';
import { recallController } from '../controllers/recall.controller';

const router = Router();

router.get('/notices', recallController.getAllNotices);
router.get('/alerts', recallController.getUserAlerts);
router.post('/check', recallController.triggerRecallCheck);
router.patch('/alerts/:alertId/read', recallController.markAlertRead);

export default router;
