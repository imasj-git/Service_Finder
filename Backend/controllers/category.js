const asyncHandler = require("../middleware/async");
const Category = require("../models/category");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: category,
    });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image, // set by uploadToCloudinary middleware
    });
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const update = {
        name: req.body.name,
        description: req.body.description,
    };
    if (req.body.image) update.image = req.body.image;
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});