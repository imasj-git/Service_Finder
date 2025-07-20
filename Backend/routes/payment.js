const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
} = require("../controllers/payment");

// Webhook doesn't need authentication
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);

module.exports = router; 