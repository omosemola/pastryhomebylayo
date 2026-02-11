const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// @route   GET /api/products/featured/list
// @desc    Get featured products
// @access  Public
router.get('/featured/list', async (req, res) => {
    try {
        const products = await Product.find({ featured: true, inStock: true }).limit(8);
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private (Admin)
router.post('/', require('../middleware/auth'), async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating product', error: err.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin)
router.put('/:id', require('../middleware/auth'), async (req, res) => {
    try {
        console.log(`[Product Update] ID: ${req.params.id}, Data:`, req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            console.log(`[Product Update] Product not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        console.error(`[Product Update Error] ${err.message}`);
        res.status(500).json({ success: false, message: 'Error updating product', error: err.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', require('../middleware/auth'), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting product', error: err.message });
    }
});

module.exports = router;
