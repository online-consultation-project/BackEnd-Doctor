const Razorpay = require("razorpay");
const crypto = require("crypto");
const Appointment = require("../models/apointment.model");
const {slot} = require("../models/admin.model");

const razorpay = new Razorpay({
  key_id: "your-razorpay-key", // Replace with your Razorpay key
  key_secret: "your-razorpay-secret", // Replace with your Razorpay secret
});

const createOrder = async (req, res) => {
  const { amount, currency, name, email, phone, doctorId, date, selectedSlot } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency,
    receipt: `order_rcptid_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      paymentOptions: {
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, ...paymentDetails } = req.body;

  const hmac = crypto.createHmac("sha256", "your-razorpay-secret"); // Replace with your Razorpay secret
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      const appointment = new Appointment({
        userId: paymentDetails.userId,
        patientName: paymentDetails.name,
        patientEmail: paymentDetails.email,
        patientPhone: paymentDetails.phone,
        patientGender: paymentDetails.gender,
        patientAge: paymentDetails.age,
        doctorId: paymentDetails.doctorId,
        slot: paymentDetails.selectedSlot,
        date: paymentDetails.date,
        paymentStatus: "Success",
      });

      await appointment.save();

      await slot.updateOne(
        { doctorId: paymentDetails.doctorId, date: paymentDetails.date },
        { $pull: { slots: paymentDetails.selectedSlot } }
      );

      res.status(200).json({ success: true, message: "Payment verified and appointment booked" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error processing appointment" });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };
