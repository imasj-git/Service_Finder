const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true,
    },
    yearsOfExperience: {
        type: String,
        required: true,
        
    },
    hourlyRate: {
        type: String,
        required: true,
        min: 0,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    // New fields for top-rated providers
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    certifications: [{
        type: String,
        trim: true,
    }],
    serviceAreas: [{
        type: String,
        trim: true,
    }],
    availability: {
        type: String,
        default: "Available Mon-Fri, 8AM-6PM",
    },
    servicesOffered: [{
        type: String,
        trim: true,
    }],
    isTopRated: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("Provider", providerSchema);
