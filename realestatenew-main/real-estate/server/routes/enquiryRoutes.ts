import { Router } from 'express';
import { 
  getEnquiries, 
  getEnquiry, 
  createEnquiry, 
  updateEnquiryStatus, 
  updateEnquiry, 
  deleteEnquiry 
} from '../controllers/enquiryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getEnquiries);
router.get('/:id', getEnquiry);
router.post('/', createEnquiry);
router.put('/:id/status', updateEnquiryStatus);
router.put('/:id', updateEnquiry);
router.delete('/:id', deleteEnquiry);

export default router;
