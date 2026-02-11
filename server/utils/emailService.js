const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps avoiding self-signed cert errors
    },
    connectionTimeout: 10000 // 10 seconds
});

// Debug: Check if env vars are loaded
console.log('📧 Email Service Initialized');
console.log('   User:', process.env.EMAIL_USER ? 'SET' : 'MISSING');
console.log('   Pass:', process.env.EMAIL_PASS ? 'SET (Length: ' + process.env.EMAIL_PASS.length + ')' : 'MISSING');

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Pastry Home by Layo" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendOrderConfirmation = async (order) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">₦${item.price.toLocaleString()}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d97706;">Order Confirmation</h2>
            <p>Dear ${order.customer.name},</p>
            <p>Thank you for your order! We have received it and will begin processing shortly.</p>
            
            <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order ID:</strong> ${order.orderNumber}</p>
                <p><strong>Total Amount:</strong> ₦${order.total.toLocaleString()}</p>
                <p><strong>Status:</strong> Pending Confirmation</p>
            </div>

            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
            </table>

            <p style="margin-top: 20px;">We will notify you once your payment is confirmed.</p>
            <p>Best regards,<br>Pastry Home by Layo Team</p>
        </div>
    `;

    return sendEmail(order.customer.email, `Order Confirmation - ${order.orderNumber}`, html);
};

const sendAdminNotification = async (order) => {
    const html = `
        <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #dc2626;">New Order Alert! 🚨</h2>
            <p>A new order has been placed.</p>
            
            <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
            
            <a href="${process.env.FRONTEND_URL}/admin.html" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a>
        </div>
    `;

    return sendEmail(process.env.EMAIL_USER, `New Order: ${order.orderNumber}`, html);
};

const sendPaymentSuccessEmail = async (order) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Payment Confirmed! ✅</h2>
            <p>Dear ${order.customer.name},</p>
            <p>We have confirmed your payment for Order <strong>${order.orderNumber}</strong>.</p>
            <p>Your order is now being processed and will be shipped soon.</p>
            
            <p>Thank you for choosing Pastry Home by Layo!</p>
        </div>
    `;

    return sendEmail(order.customer.email, `Payment Confirmed - ${order.orderNumber}`, html);
};

const sendOrderDeliveredEmail = async (order) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Order Delivered! 📦</h2>
            <p>Dear ${order.customer.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> has been delivered.</p>
            <p>We hope you enjoy your pastries! 🧁</p>
            
            <p>Thank you for choosing Pastry Home by Layo!</p>
        </div>
    `;

    return sendEmail(order.customer.email, `Order Delivered - ${order.orderNumber}`, html);
};

const sendTestEmail = async () => {
    return sendEmail(process.env.EMAIL_USER, 'Test Email from Production', 'If you see this, email is working on Render!');
};

module.exports = {
    sendOrderConfirmation,
    sendAdminNotification,
    sendPaymentSuccessEmail,
    sendOrderDeliveredEmail,
    sendTestEmail
};
