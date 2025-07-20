const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  createReview,
  getProviderReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review");

// Public routes
router.get('/provider/:providerId', getProviderReviews);

// Protected routes
router.route('/')
  .get(protect, authorize('admin'), getAllReviews)
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router; 