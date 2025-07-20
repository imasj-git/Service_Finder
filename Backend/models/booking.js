const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",      // User who made the booking
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",  // Service provider booked
    required: false,  // Not required for service bookings
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",   // Service being booked
    required: false,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,  // Time slot or exact time as string
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded", "not_required"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  // Stripe payment information
  stripePaymentIntentId: {
    type: String,
    trim: true,
  },
  stripeCustomerId: {
    type: String,
    trim: true,
  },
  // Additional booking details
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in hours
    default: 1,
  },
  isReviewed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
