const asyncHandler = require("../middleware/async");
const Review = require("../models/review");
const Provider = require("../models/provider");
const Booking = require("../models/booking");

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const { providerId, bookingId, rating, comment } = req.body;
  const userId = req.user.id;

  // Check if user has a completed booking with this provider
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
    provider: providerId,
    status: 'completed',
    isReviewed: false
  });

  if (!booking) {
    return res.status(400).json({ 
      message: "You can only review providers after completing a booking with them" 
    });
  }

  // Check if user already reviewed this provider
  const existingReview = await Review.findOne({
    user: userId,
    provider: providerId
  });

  if (existingReview) {
    return res.status(400).json({ 
      message: "You have already reviewed this provider" 
    });
  }

  // Create review
  const review = await Review.create({
    user: userId,
    provider: providerId,
    booking: bookingId,
    rating,
    comment
  });

  // Mark booking as reviewed
  booking.isReviewed = true;
  await booking.save();

  // Update provider's average rating and review count
  await updateProviderRating(providerId);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get reviews for a provider
// @route   GET /api/v1/reviews/provider/:providerId
// @access  Public
exports.getProviderReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ provider: req.params.providerId })
    .populate('user', 'fullName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Get all reviews (admin)
// @route   GET /api/v1/reviews
// @access  Private/Admin
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('user', 'fullName email')
    .populate('provider', 'fullName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ message: "Not authorized to update this review" });
  }

  const { rating, comment } = req.body;

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();

  // Update provider's average rating
  await updateProviderRating(review.provider);

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ message: "Not authorized to delete this review" });
  }

  const providerId = review.provider;

  await review.deleteOne();

  // Update provider's average rating
  await updateProviderRating(providerId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

// Helper function to update provider's average rating
const updateProviderRating = async (providerId) => {
  const reviews = await Review.find({ provider: providerId });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviews: reviews.length
    });
  } else {
    await Provider.findByIdAndUpdate(providerId, {
      rating: 0,
      reviews: 0
    });
  }
}; 