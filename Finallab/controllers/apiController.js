const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- AUTHENTICATION ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Generate the JWT Token (Expires in 1 hour)
        const payload = {
            user_id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            success: true, 
            message: 'Authentication successful',
            token: token 
        });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// --- PUBLIC ENDPOINTS ---
exports.getProducts = async (req, res) => {
    try {
        let query = {};
        
        // Basic filtering mirroring your EJS logic
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.rating) query.rating = { $gte: Number(req.query.rating) };

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find(query).skip(skip).limit(limit);
        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: products.length,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: products
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// --- PROTECTED ENDPOINTS ---
exports.getUserProfile = async (req, res) => {
    try {
        // req.user is populated by the verifyToken middleware
        const user = await User.findById(req.user.user_id).select('-password'); // Exclude password hash
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

exports.submitOrder = async (req, res) => {
    try {
        // In a real scenario, you'd validate the cart and save to an Order model here.
        // For the lab requirement, we acknowledge the payload and the authenticated user.
        const orderData = req.body;
        
        res.status(201).json({
            success: true,
            message: 'Order successfully submitted.',
            customer_id: req.user.user_id,
            orderDetails: orderData
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};