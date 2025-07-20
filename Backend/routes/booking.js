const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  createBooking,
  getBookings,
  getProviderBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  completeBooking,
} = require("../controllers/booking");

// User routes
router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getBookings);

router.get('/provider/:providerId', protect, authorize('admin'), getProviderBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, authorize('admin'), updateBooking)
  .delete(protect, authorize('admin'), deleteBooking);

router.patch('/:id/complete', protect, authorize('admin'), completeBooking);

module.exports = router;
