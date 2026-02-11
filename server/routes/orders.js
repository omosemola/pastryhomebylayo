const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { sendOrderConfirmation, sendAdminNotification } = require('../utils/emailService');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { customer, items, subtotal, shipping, total } = req.body;

        // Validate required fields
        if (!customer || !items || !items.length || !total) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create order
        const order = await Order.create({
            customer,
            items,
            subtotal,
            shipping: shipping || 0,
            total
        });

        // Send Email Notifications (Async - don't block response)
        sendOrderConfirmation(order).catch(err => console.error('Email Error (Customer):', err.message));
        sendAdminNotification(order).catch(err => console.error('Email Error (Admin):', err.message));

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Order Creation Error:', error); // Log to server console
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            details: error.errors // Mongoose validation errors
        });
    }
});

// @route   GET /api/orders/test-email
// @desc    Test email sending from production
// @access  Public
router.get('/test-email', async (req, res) => {
    try {
        const { sendTestEmail } = require('../utils/emailService');
        const result = await sendTestEmail();
        res.json({ success: true, message: 'Email sent successfully', info: result });
    } catch (error) {
        console.error('Test Email Failed:', error);
        res.status(500).json({ success: false, message: 'Email failed', error: error.message, stack: error.stack });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// @route   PATCH /api/orders/:id/confirm-payment
// @desc    Manually confirm payment and notify customer
// @access  Private (Admin)
router.patch('/:id/confirm-payment', require('../middleware/auth'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.paymentStatus === 'success') {
            return res.status(400).json({ success: false, message: 'Payment already confirmed' });
        }

        // Update Status
        order.paymentStatus = 'success';
        order.status = 'processing';
        await order.save();

        // Notify Customer
        const { sendPaymentSuccessEmail } = require('../utils/emailService');
        sendPaymentSuccessEmail(order).catch(err => console.error('Email Error (Payment Success):', err.message));

        res.json({
            success: true,
            message: 'Payment confirmed & Customer notified',
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error confirming payment',
            error: error.message
        });
    }
});

// @route   GET /api/orders/test-email
// @desc    Test email sending from production
// @access  Public
router.get('/test-email', async (req, res) => {
    try {
        const { sendTestEmail } = require('../utils/emailService');
        const result = await sendTestEmail();
        res.json({ success: true, message: 'Email sent successfully', info: result });
    } catch (error) {
        console.error('Test Email Failed:', error);
        res.status(500).json({ success: false, message: 'Email failed', error: error.message, stack: error.stack });
    }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Public (should be protected in production)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('customer.name customer.email'); // Ensure customer email is available

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send Email if status is 'delivered'
        if (status === 'delivered') {
            const { sendOrderDeliveredEmail } = require('../utils/emailService');
            sendOrderDeliveredEmail(order).catch(err => console.error('Email Error (Delivered):', err.message));
        }

        res.json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/', require('../middleware/auth'), async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product');
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: err.message });
    }
});

module.exports = router;
