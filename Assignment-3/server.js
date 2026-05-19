// 1. Import Express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash')

// 2. Set EJS as the view engine
app.set('view engine', 'ejs');

// 3. Tell Express where to find static files (CSS, Images, etc.)
app.use(express.static('public'));

// 4. Connect server.js to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kikoDB')
    .then(() => console.log('MongoDB Connected to Express Server'))
    .catch(err => console.log('Database connection error:', err));

// --- SECURITY & SESSION SETUP ---
app.use(session({
    secret: 'kiko_milano_super_secret_key', // This locks the cookie cryptographically
    resave: false, // Don't save the session if nothing changed
    saveUninitialized: false, // Don't create a session until the user actually logs in
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/kikoDB' // Saves sessions to your existing database!
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Cookie lasts for 1 day (in milliseconds)
}));

// Initialize the flash message system
app.use(flash());
// GLOBAL MIDDLEWARE: Passes data to every EJS template
app.use((req, res, next) => {
    // Make flash messages available in all EJS files
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    
    // Pass the currently logged-in user's ID to the frontend
    res.locals.currentUser = req.session.userId || null; 
    
    next(); // Move on to the next route
});

// 5. Basic Routes
app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/contact-us', (req, res) => {
    res.render('contact-us'); 
});

// 6. The Dynamic Products Route
app.get('/products', async (req, res) => {
    try {
        // --- A. FILTERING LOGIC ---
        let query = {}; // Start with an empty query (find everything)

        // Search bar
        if (req.query.search) {
            // $or tells the database: "Find this word in the Name, OR the Description, OR the Category!"
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Category
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        // Price
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice); 
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice); 
        }

        // ⭐ NEW: Rating Filter (Finds products with this rating or higher)
        if (req.query.rating) {
            query.rating = { $gte: Number(req.query.rating) };
        }

        // --- B. PAGINATION LOGIC ---
        const page = parseInt(req.query.page) || 1; 
        const limit = 8; 
        const skip = (page - 1) * limit; 

        // --- C. FETCH DATA ---
        const products = await Product.find(query).skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // --- D. SEND TO FRONTEND ---
        res.render('products', {
            products: products,
            currentPage: page,
            totalPages: totalPages,
            searchQuery: req.query 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 7. Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kiko Milano Server is running at http://localhost:${PORT}`);
});