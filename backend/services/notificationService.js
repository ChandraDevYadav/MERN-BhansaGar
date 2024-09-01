import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Function to send a new order notification
const sendNewOrderNotification = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'admin@example.com', // Replace with the admin's email address
    subject: 'New Order Placed',
    text: `A new order has been placed!\n\nOrder ID: ${order._id}\nTotal Items: ${order.totalItems}\nTotal Amount: ${order.amount}\nAddress: ${order.address}\n\nOrder Details:\n${order.items.map(item => `Item Name: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}`).join('\n')}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New order notification sent successfully.');
  } catch (error) {
    console.error('Error sending new order notification:', error);
  }
};

export { sendNewOrderNotification };
