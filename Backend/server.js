require('dotenv').config({ path: './config/config.env' });
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); // for sql injection
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();



app.use(cors({ origin: '*', credentials: true }));
// Connect to database
connectDB();
require('./utils/cleanup');
// Route files
const auth = require("./routes/customer");
const category = require("./routes/category");
const provider = require("./routes/provider");
const booking = require("./routes/booking");
const serviceRoutes = require('./routes/service');
const contactRoutes = require('./routes/contact');
const categoryRoutes = require('./routes/category');
const paymentRoutes = require('./routes/payment');
const reviewRoutes = require('./routes/review');





// Body parser
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static('public'));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/category", category);
app.use("/api/v1/provider", provider);
app.use("/api/v1/booking", booking);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);


//routes





const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold,
        `Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`.yellow.bold,
        `Cloudinary API Key: ${process.env.CLOUDINARY_API_KEY}`.yellow.bold,
        `Cloudinary API Secret: ${process.env.CLOUDINARY_API_SECRET}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;  // Export the app object

