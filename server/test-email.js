require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendTestEmail = async () => {
    try {
        console.log('Attempting to send email with:');
        console.log('User:', process.env.EMAIL_USER);
        // Don't log full password for security, just length
        console.log('Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from Local Computer",
            text: "If you see this, your email credentials are CORRECT! The issue is likely on Render."
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Failed:', error);
    }
};

sendTestEmail();
