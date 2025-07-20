const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB connected to : ${conn.connection.host}`.white.underline.bold
        );
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`.red.underline.bold);
        process.exit(1);
    }
};

module.exports = connectDB;