const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', (req, res) => {
    const { password } = req.body;

    // Check if password matches admin secret
    if (password === process.env.ADMIN_PASSWORD) {
        // Return the "token" (which is just the secret for now, or a separate secret)
        // For simplicity, we'll use the ADMIN_SECRET as the auth token
        res.json({
            success: true,
            token: process.env.ADMIN_SECRET
        });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }
});

module.exports = router;
