const asyncHandler = require("../middleware/async");
const Customer = require("../models/customer"); // lowercase if file is customer.js
const path = require("path");
const jwt = require('jsonwebtoken');

const fs = require("fs");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ==================== ADMIN ROUTES ====================

// @desc    Get all customers (Admin Only)
exports.getCustomers = asyncHandler(async (req, res, next) => {
    const customers = await Customer.find({});
    res.status(200).json({ success: true, count: customers.length, data: customers });
});

// @desc    Get single customer
exports.getCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "admin" && req.user.id !== customer.id) {
        return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ success: true, data: customer });
});

// ==================== REGISTRATION FLOW ====================

exports.register = asyncHandler(async (req, res, next) => {
    const { fname, lname, email, phone, password } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    if (await Customer.findOne({ email: email.trim().toLowerCase() })) {
        return res.status(400).json({ message: "Email is already in use" });
    }

    // Create new customer
    const customer = await Customer.create({ fname, lname, phone, email: email.trim().toLowerCase(), password });

    // Generate confirmation token
    const confirmationToken = customer.getEmailConfirmationToken();
    await customer.save();

    // Compose confirmation URL
    const confirmationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/confirm-email/${confirmationToken}`;

    try {
        await sendEmail({
            email: customer.email,
            subject: "Complete your registration",
            message: `Hi ${customer.fname},\n\nPlease click the link below to complete your registration:\n\n${confirmationUrl}\n\nThis link is valid for 1 hour.\n\nThank you!`,
        });

        return res.status(200).json({
            success: true,
            message: "Registration successful. Please check your email to complete your registration.",
        });
    } catch (error) {
        // Clean up confirmation tokens if mail failed
        customer.confirmationToken = null;
        customer.confirmationTokenExpire = null;
        await customer.save();

        return res.status(500).json({ message: "Error sending confirmation email" });
    }
});

// @desc    Confirm email
// @desc    Confirm email & auto-login
exports.confirmEmail = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const customer = await Customer.findOne({
        confirmationToken: hashedToken,
        confirmationTokenExpire: { $gt: Date.now() }
    });

    if (!customer) {
        return res.status(400).json({ message: "Invalid or expired confirmation token" });
    }

    customer.isVerified = true;
    customer.confirmationToken = null;
    customer.confirmationTokenExpire = null;

    await customer.save();

    // ✅ Auto-login after confirmation
    sendTokenResponse(customer, 200, res);
});

// ==================== AUTHENTICATION ====================

// @desc    Login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const customer = await Customer.findOne({ email }).select("+password");

    if (!customer || !(await customer.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(customer, 200, res);
});

// ==================== PROFILE UPDATE ====================

exports.updateCustomer = asyncHandler(async (req, res, next) => {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "admin" && req.user.id !== customer.id) {
        return res.status(403).json({ message: "Access denied" });
    }

    let image = customer.image;
    if (req.file) {
        if (image) {
            const imagePath = path.join(__dirname, "../public/uploads", image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        image = req.file.filename;
    }

    const { fname, lname, phone, email } = req.body;
    const updatedData = req.user.role === "admin"
        ? { fname, lname, phone, email, image, role: req.body.role }
        : { fname, lname, phone, email, image };

    customer = await Customer.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "Customer updated successfully", data: customer });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
    const allowedFields = ['fname', 'lname', 'email', 'phone', 'address', 'bio'];
    const updates = {};
    for (const key of allowedFields) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const updatedUser = await Customer.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updatedUser });
});

// ==================== PASSWORD RESET ====================

// @desc    Send password reset link
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (!customer) return res.status(404).json({ message: "No account found with that email" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    customer.confirmationToken = hashedToken;
    customer.confirmationTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await customer.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: customer.email,
            subject: "Reset Your Password",
            message: `Hi ${customer.fname},\n\nYou requested to reset your password. Please click the link below:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, just ignore this email.\n\nThanks!`,
        });

        res.status(200).json({
            success: true,
            message: "Reset password email sent. Please check your inbox.",
        });
    } catch (error) {
        customer.confirmationToken = null;
        customer.confirmationTokenExpire = null;
        await customer.save();
        res.status(500).json({ message: "Error sending reset email" });
    }
});

// @desc    Reset password via email token
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const customer = await Customer.findOne({
        confirmationToken: hashedToken,
        confirmationTokenExpire: { $gt: Date.now() },
    });

    if (!customer) return res.status(400).json({ message: "Invalid or expired reset token" });

    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    customer.password = req.body.password;
    customer.confirmationToken = null;
    customer.confirmationTokenExpire = null;
    await customer.save();

    res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
});

// ==================== PASSWORD UPDATE ====================

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Both old and new passwords are required" });

    let customer = await Customer.findById(req.params.id).select("+password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (!(await customer.matchPassword(oldPassword))) return res.status(400).json({ message: "Incorrect old password" });

    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters long" });

    customer.password = newPassword;
    await customer.save();

    const token = customer.getSignedJwtToken();

    res.status(200).json({ success: true, message: "Password updated successfully", token });
});

// ==================== ADMIN DELETE ====================

exports.deleteCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    await customer.deleteOne();

    res.status(200).json({ success: true, message: "Customer deleted successfully" });
});

// ==================== IMAGE UPLOAD ====================

exports.uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Please upload a file" });

    res.status(200).json({ success: true, message: "Image uploaded successfully", data: req.file.filename });
});

// ==================== HELPER ====================

const sendTokenResponse = (customer, statusCode, res) => {
    const token = customer.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") options.secure = true;

    res.status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token, userId: customer._id, role: customer.role });
};

// ==================== ADMIN REGISTRATION ====================

exports.registerAdmin = asyncHandler(async (req, res, next) => {
    const { fname, lname, email, phone, password } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    if (await Customer.findOne({ email: email.trim().toLowerCase() })) {
        return res.status(400).json({ message: "Email is already in use" });
    }

    // Create new admin
    const admin = await Customer.create({ fname, lname, phone, email: email.trim().toLowerCase(), password, role: 'admin', isVerified: true });

    sendTokenResponse(admin, 200, res);
});

// const { OAuth2Client } = require('google-auth-library');
// const Customer = require('../models/customer');
// const jwt = require('jsonwebtoken');

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// exports.googleAuth = asyncHandler(async (req, res, next) => {
//   const { idToken } = req.body;
//   if (!idToken) return res.status(400).json({ message: 'Google ID token is required' });

//   let ticket;
//   try {
//     ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//   } catch (error) {
//     return res.status(400).json({ message: 'Invalid Google ID token' });
//   }

//   const payload = ticket.getPayload();
//   const { email, given_name, family_name, picture } = payload;

//   let customer = await Customer.findOne({ email });

//   if (!customer) {
//     customer = await Customer.create({
//       fname: given_name,
//       lname: family_name,
//       email,
//       isVerified: true,
//       image: picture,
//       password: Math.random().toString(36).slice(-8), // Dummy password
//     });
//   }

//   // Generate JWT token
//   const token = customer.getSignedJwtToken();

//   res.status(200).json({ success: true, token, userId: customer._id, role: customer.role });
// });

