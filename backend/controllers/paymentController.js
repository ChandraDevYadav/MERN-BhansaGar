// controllers/paymentController.js

export const initiateEsewaPayment = async (req, res) => {
    const { amount, orderId } = req.body;
  
    // Check if orderId exists
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }
  
    const esewaPaymentUrl = `https://esewa.com.np/epay/main?amt=${amount}&pid=${orderId}&scd=${process.env.ESEWA_MERCHANT_ID}&su=${process.env.BASE_URL}/api/payment/esewa-callback?success=true&oid=${orderId}&fu=${process.env.BASE_URL}/api/payment/esewa-callback?success=false`;

res.json({ success: true, esewaPaymentUrl });

  };
  
  
  export const esewaCallback = async (req, res) => {
    const { success, oid, amt, refId } = req.query;
  
    if (success === "true") {
      // Here you can verify the payment using eSewa's API if necessary
  
      // Update order status to 'Paid'
      // Example: await Order.findByIdAndUpdate(oid, { status: 'Paid' });
  
      res.redirect('/order-success');
    } else {
      // Handle failed payment
      res.redirect('/order-failed');
    }
  };
  