// utils/sendEmail.js
const nodemailer = require('nodemailer');

module.exports = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS  // your Gmail app password or normal password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error.message);
        throw new Error('Error sending email');
    }
};
