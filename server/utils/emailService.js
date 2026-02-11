const nodemailer = require('nodemailer');

const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);

let transporter;

const initializeEmailService = async () => {
    try {
        const addresses = await resolve4('smtp.gmail.com');
        const gmailIp = addresses[0];
        console.log(`📧 Resolved Gmail IPv4: ${gmailIp}`);

        transporter = nodemailer.createTransport({
            host: gmailIp, // Use resolved IP directly
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                servername: 'smtp.gmail.com', // Vital for SSL verification
                rejectUnauthorized: false
            },
            connectionTimeout: 30000 // 30 seconds
        });

        console.log(`📧 Email Service Initialized (IPv4 Forced: ${gmailIp})`);
    } catch (error) {
        console.error('❌ Failed to resolve Gmail IP:', error);
        // Throw error to see it in the test response
        throw new Error(`DNS Resolution Failed: ${error.message}`);
    }
};

// Initialize immediately
initializeEmailService().catch(err => console.error(err));

const sendEmail = async (to, subject, html) => {
    try {
        if (!transporter) {
            console.log('⏳ Waiting for email transport initialization...');
            await initializeEmailService();
        }

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

const net = require('net');

const testConnection = (port) => {
    return new Promise((resolve, reject) => {
        console.log(`🔌 Testing TCP connection to smtp.gmail.com:${port}...`);
        const socket = new net.Socket();
        let status = 'pending';

        // Timeout after 5s
        socket.setTimeout(5000);

        socket.on('connect', () => {
            console.log(`✅ Connected to smtp.gmail.com:${port}`);
            status = 'success';
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ Timeout connecting to smtp.gmail.com:${port}`);
            status = 'timeout';
            socket.destroy();
            reject(new Error('Connection Timed Out'));
        });

        socket.on('error', (err) => {
            console.log(`❌ Error connecting to smtp.gmail.com:${port}:`, err.message);
            reject(err);
        });

        socket.connect(port, 'smtp.gmail.com');
    });
};

const sendTestEmail = async () => {
    // 1. Pre-flight Network Check
    const results = { port587: 'failed', port465: 'failed' };

    try {
        await testConnection(587);
        results.port587 = 'success';
    } catch (e) { results.port587 = e.message; }

    try {
        await testConnection(465);
        results.port465 = 'success';
    } catch (e) { results.port465 = e.message; }

    if (results.port587 !== 'success' && results.port465 !== 'success') {
        throw new Error(`NETWORK BLOCK DETECTED. Port 587: ${results.port587}, Port 465: ${results.port465}`);
    }

    // 2. If valid, try sending (Reusing previous robust config logic)
    // We re-init here to ensure we use the working config if possible, 
    // but for now let's just use the default transport if check passes.
    if (!transporter) await initializeEmailService();

    return sendEmail(process.env.EMAIL_USER, 'Test Email from Production',
        `Network Check: Passed!\nPort 587: ${results.port587}\nPort 465: ${results.port465}\n\nEmail sent successfully.`);
};

const getDebugInfo = () => {
    return {
        transport: transporter ? 'Initialized' : 'Not Initialized',
        host: transporter && transporter.options ? transporter.options.host : 'Unknown'
    };
};

module.exports = {
    sendOrderConfirmation,
    sendAdminNotification,
    sendPaymentSuccessEmail,
    sendOrderDeliveredEmail,
    sendTestEmail,
    getDebugInfo
};
