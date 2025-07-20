const asyncHandler = require("../middleware/async");
const Provider = require("../models/provider");
const Category = require("../models/category");
const Review = require("../models/review");

// @desc    Get all providers
// @route   GET /api/v1/providers
// @access  Public
exports.getProviders = asyncHandler(async (req, res, next) => {
    const { topRated, category, rating } = req.query;
    
    let query = {};
    
    // Filter by top-rated providers
    if (topRated === 'true') {
        query.isTopRated = true;
    }
    
    // Filter by category
    if (category) {
        query.category = category;
    }
    
    // Filter by minimum rating
    if (rating) {
        query.rating = { $gte: parseFloat(rating) };
    }
    
    const providers = await Provider.find(query)
        .populate("category", "name")
        .sort({ rating: -1, reviews: -1 });
        
    res.status(200).json({
        success: true,
        count: providers.length,
        data: providers,
    });
});

// @desc    Get top-rated providers
// @route   GET /api/v1/providers/top-rated
// @access  Public
exports.getTopRatedProviders = asyncHandler(async (req, res, next) => {
    const providers = await Provider.find({ 
        isTopRated: true,
        rating: { $gte: 4.0 }
    })
        .populate("category", "name")
        .sort({ rating: -1, reviews: -1 })
        .limit(10);
        
    res.status(200).json({
        success: true,
        count: providers.length,
        data: providers,
    });
});

// @desc    Get single provider with reviews
// @route   GET /api/v1/providers/:id
// @access  Public
exports.getProvider = asyncHandler(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id)
        .populate("category", "name");
        
    if (!provider) {
        return res.status(404).json({ message: `Provider not found with id of ${req.params.id}` });
    }
    
    // Get recent reviews for this provider
    const reviews = await Review.find({ provider: req.params.id })
        .populate('user', 'fullName')
        .sort({ createdAt: -1 })
        .limit(5);
    
    res.status(200).json({
        success: true,
        data: {
            ...provider.toObject(),
            recentReviews: reviews
        },
    });
});

// @desc    Create new provider
// @route   POST /api/v1/providers
// @access  Private (Admin)
exports.createProvider = asyncHandler(async (req, res, next) => {
    const {
        fullName,
        email,
        phoneNumber,
        category,
        yearsOfExperience,
        hourlyRate,
        address,
        bio,
        certifications,
        serviceAreas,
        servicesOffered,
        availability,
        isTopRated
    } = req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        return res.status(400).json({ message: "Category not found" });
    }

    // Check if provider with same email already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
        return res.status(400).json({ message: "Provider with this email already exists" });
    }

    if (typeof yearsOfExperience !== 'string' || yearsOfExperience.trim() === '') {
        return res.status(400).json({ message: "Invalid or missing yearsOfExperience" });
    }

    if (typeof hourlyRate !== 'string' || hourlyRate.trim() === '') {
        return res.status(400).json({ message: "Invalid or missing hourlyRate" });
    }

    // Check image file presence (assuming you're using multer)
    if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
    }

    // Create new provider
    const provider = await Provider.create({
        fullName,
        email,
        phoneNumber,
        category,
        yearsOfExperience,
        hourlyRate,
        address,
        bio,
        image: req.file.filename,
        certifications: certifications ? certifications.split(',').map(cert => cert.trim()) : [],
        serviceAreas: serviceAreas ? serviceAreas.split(',').map(area => area.trim()) : [],
        servicesOffered: servicesOffered ? servicesOffered.split(',').map(service => service.trim()) : [],
        availability: availability || "Available Mon-Fri, 8AM-6PM",
        isTopRated: isTopRated || false
    });

    res.status(201).json({
        success: true,
        message: "Provider created successfully",
        data: provider,
    });
});

// @desc    Update provider
// @route   PUT /api/v1/providers/:id
// @access  Private (Admin)
exports.updateProvider = asyncHandler(async (req, res, next) => {
    let provider = await Provider.findById(req.params.id);
    if (!provider) {
        return res.status(404).json({ message: `Provider not found with id of ${req.params.id}` });
    }

    const {
        fullName,
        email,
        phoneNumber,
        category,
        yearsOfExperience,
        hourlyRate,
        address,
        bio,
        certifications,
        serviceAreas,
        servicesOffered,
        availability,
        isTopRated
    } = req.body;

    // Handle optional image update
    let image = provider.image;
    if (req.file) {
        image = req.file.filename;
    }

    provider = await Provider.findByIdAndUpdate(
        req.params.id,
        {
            fullName,
            email,
            phoneNumber,
            category,
            yearsOfExperience,
            hourlyRate,
            address,
            bio,
            image,
            certifications: certifications ? certifications.split(',').map(cert => cert.trim()) : provider.certifications,
            serviceAreas: serviceAreas ? serviceAreas.split(',').map(area => area.trim()) : provider.serviceAreas,
            servicesOffered: servicesOffered ? servicesOffered.split(',').map(service => service.trim()) : provider.servicesOffered,
            availability: availability || provider.availability,
            isTopRated: isTopRated !== undefined ? isTopRated : provider.isTopRated
        },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Provider updated successfully",
        data: provider,
    });
});

// @desc    Delete provider
// @route   DELETE /api/v1/providers/:id
// @access  Private (Admin)
exports.deleteProvider = asyncHandler(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
        return res.status(404).json({ message: `Provider not found with id of ${req.params.id}` });
    }

    await provider.deleteOne();

    res.status(200).json({
        success: true,
        message: "Provider deleted successfully",
    });
});

// @desc    Mark provider as top-rated
// @route   PATCH /api/v1/providers/:id/top-rated
// @access  Private (Admin)
exports.markAsTopRated = asyncHandler(async (req, res, next) => {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
        return res.status(404).json({ message: `Provider not found with id of ${req.params.id}` });
    }

    provider.isTopRated = true;
    await provider.save();

    res.status(200).json({
        success: true,
        message: "Provider marked as top-rated successfully",
        data: provider,
    });
});

// @desc    Toggle provider verification status
// @route   PATCH /api/v1/providers/:id/verify
// @access  Private (Admin)
exports.toggleVerification = asyncHandler(async (req, res, next) => {
    const { isVerified } = req.body;
    
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
        return res.status(404).json({ message: `Provider not found with id of ${req.params.id}` });
    }

    provider.verified = isVerified;
    await provider.save();

    res.status(200).json({
        success: true,
        message: `Provider ${isVerified ? 'verified' : 'unverified'} successfully`,
        data: provider,
    });
});
