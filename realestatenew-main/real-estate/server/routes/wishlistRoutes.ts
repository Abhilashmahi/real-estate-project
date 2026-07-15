import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:propertyId', removeFromWishlist);

export default router;
