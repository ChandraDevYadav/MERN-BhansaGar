import express from 'express';
import { resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Route for password reset
router.post('/reset-password/:token', resetPassword);

export default router;
