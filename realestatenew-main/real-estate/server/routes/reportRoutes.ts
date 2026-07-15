import { Router } from 'express';
import { getReportSummary } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/summary', getReportSummary);

export default router;
