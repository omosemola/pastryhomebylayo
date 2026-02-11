const axios = require('axios');

const sendEmail = async (to, subject, htmlContent) => {
    const apiKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : null;
    const senderEmail = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;

    if (!apiKey) {
        console.error('❌ BREVO_API_KEY is missing in environment variables');
        return;
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: "Pastry Home by Layo",
                    email: senderEmail // Validated sender in Brevo
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json'
                }
            }
        );

        console.log(`✅ Email sent to ${to}. MessageId: ${response.data.messageId}`);
        return response.data;
    } catch (error) {
        // Debug: Log key length to verify it's loaded
        console.error('❌ Error sending email via Brevo:', error.response ? error.response.data : error.message);
        console.error('   API Key Loaded:', apiKey ? `YES (Length: ${apiKey.length})` : 'NO');
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
    return sendEmail(
        process.env.EMAIL_USER,
        'Test Email from Brevo API',
        '<h3>It Works! 🎉</h3><p>If you see this, the Brevo API is successfully sending emails from Render!</p>'
    );
};

module.exports = {
    sendOrderConfirmation,
    sendAdminNotification,
    sendPaymentSuccessEmail,
    sendOrderDeliveredEmail,
    sendTestEmail
};
