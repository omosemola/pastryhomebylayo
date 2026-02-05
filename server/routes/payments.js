const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// @route   POST /api/payments/initialize
// @desc    Initialize Paystack payment
// @access  Public
router.post('/initialize', async (req, res) => {
    try {
        const { email, amount, orderId, metadata } = req.body;

        // Validate required fields
        if (!email || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Email and amount are required'
            });
        }

        // Initialize payment with Paystack
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Convert to kobo/cents
                metadata: {
                    orderId,
                    ...metadata
                },
                callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5500'}/payment-success.html`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error initializing payment',
            error: error.response?.data?.message || error.message
        });
    }
});

// @route   POST /api/payments/verify
// @desc    Verify Paystack payment
// @access  Public
router.post('/verify', async (req, res) => {
    try {
        const { reference } = req.body;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: 'Payment reference is required'
            });
        }

        // Verify payment with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const paymentData = response.data.data;

        // Update order if payment was successful
        if (paymentData.status === 'success' && paymentData.metadata?.orderId) {
            await Order.findByIdAndUpdate(
                paymentData.metadata.orderId,
                {
                    paymentReference: reference,
                    paymentStatus: 'success',
                    status: 'processing'
                }
            );
        }

        res.json({
            success: true,
            data: paymentData
        });
    } catch (error) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;
