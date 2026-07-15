import { Router } from 'express';
import { 
  getFollowups, 
  createFollowup, 
  toggleFollowup, 
  updateFollowup, 
  deleteFollowup 
} from '../controllers/followupController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getFollowups);
router.post('/', createFollowup);
router.put('/:id/toggle', toggleFollowup);
router.put('/:id', updateFollowup);
router.delete('/:id', deleteFollowup);

export default router;
