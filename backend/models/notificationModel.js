import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  orderId: mongoose.Schema.Types.ObjectId,
  message: String,
  date: { type: Date, default: Date.now },
  // Add other relevant fields
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
