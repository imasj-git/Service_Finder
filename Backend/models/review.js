const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    }
}, { timestamps: true });

// Prevent user from submitting more than one review per provider
reviewSchema.index({ user: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema); 