const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay configuration
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_1xjRZU43gpPuYd', // Replace with your Razorpay Key ID
  key_secret: 'DzgSWIkH9P4fQdWMHOxbfXeU' // Replace with your Razorpay Key Secret
});

// Controller methods
const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: order.id,
      paymentOptions: order
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order.' });
  }
};

const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(req.body);
    

    const hmac = crypto.createHmac('sha256', razorpayInstance.key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment.' });
  }
};

module.exports = { createOrder, verifyPayment };
