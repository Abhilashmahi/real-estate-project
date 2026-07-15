import { Router } from 'express';
import { getSiteVisits, createSiteVisit, updateSiteVisitStatus } from '../controllers/siteVisitController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getSiteVisits);
router.post('/', createSiteVisit);
router.put('/:id/status', updateSiteVisitStatus);

export default router;
