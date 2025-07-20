const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const customerSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        phone: {
            required: [true, "Phone number is required"],
            type: Number,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
        },

        password: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            type: String,
            default: null,
            trim: true,
        },
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        confirmationToken: {
            type: String,
            default: null,
        },
        confirmationTokenExpire: {
            type: Date,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpire: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Pre-save password hashing
customerSchema.pre("save", async function (next) {
    // Only hash if password is present and modified
    if (!this.password || !this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Generate JWT
customerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Match passwords
customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email confirmation token
customerSchema.methods.getEmailConfirmationToken = function () {
    const confirmationToken = crypto.randomBytes(20).toString("hex");
    this.confirmationToken = crypto
        .createHash("sha256")
        .update(confirmationToken)
        .digest("hex");
    this.confirmationTokenExpire = Date.now() + 60 * 60 * 1000; // valid for 1 hour
    return confirmationToken;
};
customerSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // valid for 1 hour

    return resetToken;
};

module.exports = mongoose.model("Customer", customerSchema);
