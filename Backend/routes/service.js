const express = require('express');
const { createService, getServices, getService, updateService, deleteService } = require('../controllers/service');
const { protect, authorize } = require('../middleware/auth');
const { memoryUpload, uploadToCloudinary } = require('../middleware/uploads');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), memoryUpload.single('image'), uploadToCloudinary, createService);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('admin'), memoryUpload.single('image'), uploadToCloudinary, updateService)
  .delete(protect, authorize('admin'), deleteService);

module.exports = router; 