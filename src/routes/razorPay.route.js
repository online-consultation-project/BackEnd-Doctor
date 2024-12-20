// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/razorPay.controller');
const userVerifyToken = require('../middlewares/userAuthToken');

// Endpoint to create an order
router.post('/create-order', userVerifyToken.verifyToken,createOrder);
router.post("/verify-payment",userVerifyToken.verifyToken, verifyPayment);

module.exports = router;