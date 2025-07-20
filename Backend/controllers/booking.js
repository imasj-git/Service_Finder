const asyncHandler = require("../middleware/async");
const Booking = require("../models/booking");
const Service = require("../models/service");
const Provider = require("../models/provider");

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private (assuming user auth)
exports.createBooking = asyncHandler(async (req, res, next) => {
  const {
    provider,
    service,
    bookingDate,
    bookingTime,
    address,
    city,
    notes,
    duration = 1,
    totalPrice: requestedPrice, // Allow frontend to send totalPrice
  } = req.body;

  const userId = req.user.id;

  // Basic presence check
  if (!bookingDate || !bookingTime || !address || !city) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  // Check if either provider or service is provided
  if (!provider && !service) {
    return res.status(400).json({ message: "Either provider or service must be specified" });
  }

  let totalPrice = 0;
  let bookingData = {
    user: userId,
    bookingDate,
    bookingTime,
    address,
    city,
    notes,
    duration,
    status: "pending",
    paymentStatus: "pending", // Default to pending for all bookings
  };

  // Handle provider booking
  if (provider) {
    const providerDoc = await Provider.findById(provider);
    if (!providerDoc) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const hourlyRate = parseFloat(providerDoc.hourlyRate);
    totalPrice = requestedPrice ? parseFloat(requestedPrice) : hourlyRate * duration;

    // Validate totalPrice
    if (totalPrice <= 0) {
      return res.status(400).json({ message: "Total price must be greater than zero for provider bookings" });
    }

    const existingBooking = await Booking.findOne({
      provider,
      bookingDate,
      bookingTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    bookingData.provider = provider;
    bookingData.totalPrice = totalPrice;
  }

  // Handle service booking
  if (service) {
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Use requestedPrice if provided, otherwise use service price
    totalPrice = requestedPrice ? parseFloat(requestedPrice) : parseFloat(serviceDoc.price || 0);

    // Validate totalPrice
    if (totalPrice <= 0) {
      return res.status(400).json({ message: "Total price must be greater than zero for service bookings" });
    }

    bookingData.service = service;
    bookingData.totalPrice = totalPrice;
    bookingData.paymentStatus = "pending"; // Require payment for service bookings
  }

  try {
    const booking = await Booking.create(bookingData);
    console.log('Booking created:', {
      bookingId: booking._id,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      isProviderBooking: !!booking.provider,
      isServiceBooking: !!booking.service,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
});

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate("user", "fullName email")
    .populate("provider", "fullName phoneNumber hourlyRate")
    .populate("service", "name description price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get bookings for a specific provider
// @route   GET /api/v1/bookings/provider/:providerId
// @access  Private/Admin
exports.getProviderBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ provider: req.params.providerId })
    .populate("user", "fullName email phone")
    .populate("provider", "fullName phoneNumber")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private/Admin/User
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "fullName email phone")
    .populate("provider", "fullName phoneNumber hourlyRate image")
    .populate("service", "name description price");

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Update booking status or details
// @route   PUT /api/v1/bookings/:id
// @access  Private/Admin
exports.updateBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const allowedUpdates = ["status", "bookingDate", "bookingTime", "totalPrice", "paymentStatus"];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      booking[field] = req.body[field];
    }
  });

  try {
    await booking.save();
    console.log('Booking updated:', {
      bookingId: booking._id,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
    });
  } catch (error) {
    console.error('Booking update error:', error);
    return res.status(500).json({ message: "Failed to update booking", error: error.message });
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  try {
    await booking.deleteOne();
    console.log('Booking deleted:', req.params.id);
  } catch (error) {
    console.error('Booking deletion error:', error);
    return res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
});

// @desc    Get bookings for the currently authenticated user
// @route   GET /api/v1/booking/my
// @access  Private/User
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("provider", "fullName phoneNumber hourlyRate image")
    .populate("service", "name description price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Complete a booking (mark as completed)
// @route   PATCH /api/v1/bookings/:id/complete
// @access  Private/Admin
exports.completeBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.paymentStatus !== 'paid' && booking.paymentStatus !== 'not_required') {
    return res.status(400).json({ message: "Payment must be completed before marking booking as completed" });
  }

  booking.status = 'completed';
  try {
    await booking.save();
    console.log('Booking completed:', {
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
      status: booking.status,
    });
  } catch (error) {
    console.error('Booking completion error:', error);
    return res.status(500).json({ message: "Failed to complete booking", error: error.message });
  }

  res.status(200).json({
    success: true,
    message: "Booking marked as completed",
    data: booking,
  });
});