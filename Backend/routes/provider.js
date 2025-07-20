const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/uploads");

const {
  getProviders,
  getTopRatedProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  markAsTopRated,
  toggleVerification,
} = require("../controllers/provider");

// Public routes
router.get('/top-rated', getTopRatedProviders);
router.get('/:id', getProvider);
router.get('/', getProviders);

// Protected routes (Admin only)
router.route('/')
  .post(protect, authorize('admin'), upload.single('image'), createProvider);

router.route('/:id')
  .put(protect, authorize('admin'), upload.single('image'), updateProvider)
  .delete(protect, authorize('admin'), deleteProvider);

router.patch('/:id/top-rated', protect, authorize('admin'), markAsTopRated);
router.patch('/:id/verify', protect, authorize('admin'), toggleVerification);

module.exports = router;
