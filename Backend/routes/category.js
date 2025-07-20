const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { memoryUpload, uploadToCloudinary } = require("../middleware/uploads"); 

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/category");


router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), memoryUpload.single('image'), uploadToCloudinary, createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), memoryUpload.single('image'), uploadToCloudinary, updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;