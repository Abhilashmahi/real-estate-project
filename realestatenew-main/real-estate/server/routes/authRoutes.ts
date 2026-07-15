import { Router } from 'express';
import { 
  login, 
  adminLogin, 
  customerLogin, 
  customerRegister, 
  getCustomerProfile, 
  updateCustomerProfile 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Admin Auth
router.post('/login', login); // Compatibility fallback
router.post('/admin/login', adminLogin);

// Customer Auth
router.post('/customer/login', customerLogin);
router.post('/customer/register', customerRegister);
router.get('/customer/profile', authenticateToken, getCustomerProfile);
router.put('/customer/profile', authenticateToken, updateCustomerProfile);

export default router;
