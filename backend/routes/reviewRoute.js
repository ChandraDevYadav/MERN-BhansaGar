import express from 'express';
import { addReview, getItemReviews } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authMiddleware, addReview);
router.get('/:itemType/:itemId/reviews', getItemReviews);

export default router;
