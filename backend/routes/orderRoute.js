// orderRouter.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  getTotalUsers,
  getTotalOrders,
  getTotalItems,
  getNewOrderNotifications
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/list', listOrders);
orderRouter.post('/status', updateStatus);
orderRouter.get('/total-users', getTotalUsers);
orderRouter.get('/total-orders', getTotalOrders);
orderRouter.get('/total-items', getTotalItems);
orderRouter.get('/new-order-notifications', getNewOrderNotifications);

export default orderRouter;
