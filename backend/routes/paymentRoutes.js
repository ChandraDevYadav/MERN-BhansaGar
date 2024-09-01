// routes/paymentRoutes.js

import express from 'express';
import { initiateEsewaPayment, esewaCallback } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate-esewa-payment', initiateEsewaPayment);
router.get('/esewa-callback', esewaCallback);

export default router;
