const asyncHandler = require("../middleware/async");
const stripe = require("../config/stripe");
const Booking = require("../models/booking");
const Provider = require("../models/provider");

// @desc    Create payment intent for booking
// @route   POST /api/v1/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { bookingId, amount } = req.body;

  // Validate request body
  if (!bookingId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Booking ID and a valid amount are required" });
  }

  const booking = await Booking.findById(bookingId)
    .populate('provider', 'fullName hourlyRate')
    .populate('user', 'fullName email')
    .populate('service', 'name description price');

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.paymentStatus === 'paid') {
    return res.status(400).json({ message: "Payment already completed" });
  }

  // Log booking details
  console.log('Creating payment intent for booking:', {
    bookingId: booking._id,
    isProviderBooking: !!booking.provider,
    isServiceBooking: !!booking.service,
    requestedAmount: amount,
    bookingTotalPrice: booking.totalPrice,
    paymentStatus: booking.paymentStatus,
  });

  // Use provided amount (in cents) or booking.totalPrice (convert to cents)
  const paymentAmount = amount || Math.round(booking.totalPrice * 100);

  if (paymentAmount <= 0) {
    return res.status(400).json({ message: "Payment amount must be greater than zero" });
  }

  try {
    console.log('Creating payment intent for amount:', paymentAmount);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        userId: booking.user._id.toString(),
        providerId: booking.provider ? booking.provider._id.toString() : null,
        serviceId: booking.service ? booking.service._id.toString() : null,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    // Update booking with payment intent ID
    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: paymentAmount,
    });
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
});

// @desc    Confirm payment and update booking status
// @route   POST /api/v1/payment/confirm
// @access  Private
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { bookingId, paymentIntentId } = req.body;

  // Validate request body
  if (!bookingId || !paymentIntentId) {
    return res.status(400).json({ message: "Booking ID and payment intent ID are required" });
  }

  const booking = await Booking.findById(bookingId)
    .populate('provider', 'fullName hourlyRate')
    .populate('service', 'name description price');

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  try {
    console.log('Confirming payment for booking:', {
      bookingId,
      paymentIntentId,
      isProviderBooking: !!booking.provider,
      isServiceBooking: !!booking.service,
      currentPaymentStatus: booking.paymentStatus,
    });

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('Payment intent status:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      // Update booking status
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      try {
        await booking.save();
        console.log('Booking updated successfully:', {
          bookingId: booking._id,
          paymentStatus: booking.paymentStatus,
          status: booking.status,
        });
      } catch (saveError) {
        console.error('Booking save error in confirmPayment:', saveError);
        return res.status(500).json({ message: "Failed to update booking after payment", error: saveError.message });
      }

      res.status(200).json({
        success: true,
        message: "Payment confirmed successfully",
        data: booking,
      });
    } else {
      console.log('Payment not completed, status:', paymentIntent.status);
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
});

// @desc    Webhook to handle Stripe events
// @route   POST /api/v1/payment/webhook
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper function to handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  const bookingId = paymentIntent.metadata.bookingId;

  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      try {
        await booking.save();
        console.log('Webhook: Payment success, booking updated:', {
          bookingId,
          paymentStatus: booking.paymentStatus,
          status: booking.status,
        });
      } catch (error) {
        console.error('Webhook: Booking save error:', error);
      }
    } else {
      console.error('Webhook: Booking not found:', bookingId);
    }
  } else {
    console.error('Webhook: No bookingId in payment intent metadata');
  }
};

// Helper function to handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  const bookingId = paymentIntent.metadata.bookingId;

  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paymentStatus = 'failed';
      try {
        await booking.save();
        console.log('Webhook: Payment failed, booking updated:', {
          bookingId,
          paymentStatus: booking.paymentStatus,
        });
      } catch (error) {
        console.error('Webhook: Booking save error:', error);
      }
    } else {
      console.error('Webhook: Booking not found:', bookingId);
    }
  } else {
    console.error('Webhook: No bookingId in payment intent metadata');
  }
};