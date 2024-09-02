import dotenv from 'dotenv';
import NotificationModel from '../models/notificationModel.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const frontend_url = "https://mern-bhansagar-frontend.onrender.com";

// Placing user order for frontend
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    // Create and save new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === 'stripe') {
      const line_items = items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: 2 * 100,
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${frontend_url}/myorders?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/cart?canceled=true&orderId=${newOrder._id}`,
      });

      res.json({ success: true, session_url: session.url });
    } else if (paymentMethod === 'esewa') {
      const esewaConfig = {
        amt: amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: amount,
        pid: newOrder._id,
        scd: process.env.ESEWA_MERCHANT_ID,
        su: `${frontend_url}/api/payment/esewa/success`,
        fu: `${frontend_url}/api/payment/esewa/failure`
      };

      const esewaUrl = `https://esewa.com.np/epay/main?amt=${esewaConfig.amt}&pdc=${esewaConfig.pdc}&psc=${esewaConfig.psc}&txAmt=${esewaConfig.txAmt}&tAmt=${esewaConfig.tAmt}&pid=${esewaConfig.pid}&scd=${esewaConfig.scd}&su=${encodeURIComponent(esewaConfig.su)}&fu=${encodeURIComponent(esewaConfig.fu)}`;

      res.json({ success: true, esewaUrl });
    } else if (paymentMethod === 'cod') {
      // For Cash on Delivery, just return success as COD does not require a payment URL
      res.json({ success: true, message: 'Order placed successfully with Cash on Delivery' });
    } else {
      res.json({ success: false, message: 'Invalid payment method' });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Error placing order' });
  }
};

// Verify order status
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).json({ success: false, message: 'Error verifying order' });
  }
};

// Get orders for a user
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching user orders' });
  }
};

// List all orders for admin
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// Update order status
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// Get total number of users
export const getTotalUsers = async (req, res) => {
  try {
    const userCount = await userModel.countDocuments();
    res.json({ success: true, totalUsers: userCount });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ success: false, message: 'Error fetching total users' });
  }
};

// Get total number of orders
export const getTotalOrders = async (req, res) => {
  try {
    const orderCount = await orderModel.countDocuments();
    res.json({ success: true, totalOrders: orderCount });
  } catch (error) {
    console.error('Error fetching total orders:', error);
    res.status(500).json({ success: false, message: 'Error fetching total orders' });
  }
};

// Get total number of items
export const getTotalItems = async (req, res) => {
  try {
    const totalItems = await orderModel.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, total: { $sum: "$items.quantity" } } }
    ]);

    const totalItemsCount = totalItems.length > 0 ? totalItems[0].total : 0;
    res.json({ success: true, totalItems: totalItemsCount });
  } catch (error) {
    console.error('Error fetching total items:', error);
    res.status(500).json({ success: false, message: 'Error fetching total items' });
  }
};

// Get new order notifications
export const getNewOrderNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find({/* criteria for new orders */});
    
    if (notifications.length > 0) {
      res.json({ success: true, notificationMessage: 'You have new orders!' });
    } else {
      res.json({ success: true, notificationMessage: '' });
    }
  } catch (error) {
    console.error('Error fetching new order notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};
