import { Router } from 'express';
import { communityController } from '../controllers/community.controller';

const router = Router();

router.get('/submissions', communityController.getAllSubmissions);
router.get('/submissions/:id', communityController.getSubmissionById);
router.post('/submit', communityController.submitProduct);
router.post('/verify', communityController.verifySubmission);

export default router;
