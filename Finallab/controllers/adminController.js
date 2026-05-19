const Product = require('../models/Product');
const Order = require('../models/order'); // ✨ NEW: Import the Order model

exports.getDashboard = async (req, res) => {
    try {
        const products = await Product.find(); 
        const totalProducts = products.length;
        let totalValue = 0;
        let lowStockCount = 0;

        products.forEach(product => {
            totalValue += (product.price * product.stock); 
            if (product.stock < 5) {
                lowStockCount++; 
            }
        });

        res.render('admin-dashboard', { products, totalProducts, totalValue, lowStockCount });
    } catch (err) {
        res.status(500).send("Error loading dashboard");
    }
};

exports.getAddProduct = (req, res) => {
    res.render('admin-form', { product: null });
};

exports.postAddProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            stock: req.body.stock,
            rating: req.body.rating || 0,
            image: req.file ? 'uploads/' + req.file.filename : 'Logo.webp'
        });
        await newProduct.save();
        req.flash('success_msg', 'Product added successfully!');
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error adding product.');
        res.redirect('/admin/product/add');
    }
};

exports.getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin-form', { product }); 
    } catch (err) {
        res.redirect('/admin');
    }
};

exports.postEditProduct = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            stock: req.body.stock
        };
        if (req.file) {
            updateData.image = 'uploads/' + req.file.filename;
        }
        await Product.findByIdAndUpdate(req.params.id, updateData);
        req.flash('success_msg', 'Product updated successfully!');
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
};

exports.postDeleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Product permanently deleted.');
        res.redirect('/admin');
    } catch (err) {
        res.redirect('/admin');
    }
};

// ==========================================
//          PHASE 2: SALES DASHBOARD LOGIC
// ==========================================

// 1. Initial Page Load (Server-Side Rendering)
exports.getSalesDashboard = async (req, res) => {
    try {
        // Renders the empty HTML shell. The jQuery will fetch the live data instantly.
        res.render('sales', { 
            title: 'Live Sales Dashboard'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to load sales dashboard.');
        res.redirect('/admin');
    }
};

// 2. The Live API Endpoint (Returns raw JSON for jQuery to read)
exports.getLiveSalesData = async (req, res) => {
    try {
        // A. Get Total Number of Orders
        const totalOrders = await Order.countDocuments();

        // B. Calculate Total Revenue using MongoDB Aggregation
        const revenueCalc = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueCalc.length > 0 ? revenueCalc[0].totalRevenue : 0;

        // C. Get the 5 Most Recent Transactions
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5)
            .populate('customer', 'name email'); // Grab customer name/email from User model

        // D. Send everything back as a pristine JSON package
        res.json({
            success: true,
            data: {
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
                recentOrders: recentOrders
            }
        });

    } catch (err) {
        console.error("Live Data Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching live data.' });
    }
};