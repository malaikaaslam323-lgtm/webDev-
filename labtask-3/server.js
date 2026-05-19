// 1. Import Express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash')
const User = require('./models/User'); // Adjust path if your User.js is somewhere else
const bcrypt = require('bcryptjs');

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
    secret: 'kiko_milano_super_secret_key', 
    resave: false, 
    saveUninitialized: false, 
    // MODERN SYNTAX:
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/kikoDB' 
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
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
//server read data from html
app.use(express.urlencoded({ extended: true })); // Allows server to read form data (req.body)

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

// --- REGISTRATION ROUTES ---

// 1. Show the Registration Form
app.get('/register', (req, res) => {
    res.render('register'); // This will load a register.ejs file
});

// 2. Process the Registration Data
app.post('/register', async (req, res) => {
    try {
        // Step A: Grab the data the user typed into the HTML form
        const { name, email, password } = req.body;

        // Step B: Check if someone is already using this email
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('error_msg', 'That email is already registered. Please log in.');
            return res.redirect('/register'); // Kick them back to the form
        }

        // Step C: The Vault! Hash the password
        const salt = await bcrypt.genSalt(10); // Generate 10 rounds of random data
        const hashedPassword = await bcrypt.hash(password, salt); // Scramble the password!

        // Step D: Create the new user using our User.js blueprint
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword 
            // Notice we don't mention 'role'. It defaults to 'customer' automatically!
        });

        // Step E: Save to MongoDB
        await newUser.save();

        // Step F: Show a success message and send them to the login page
        req.flash('success_msg', 'Registration successful! You can now log in.');
        res.redirect('/login');

    } catch (err) {
        console.error("Registration Error:", err);
        req.flash('error_msg', 'An error occurred during registration.');
        res.redirect('/register');
    }
});
// --- LOGIN ROUTES ---

// 1. Show the Login Form
app.get('/login', (req, res) => {
    res.render('login'); // This will load a login.ejs file
});

// 2. Process the Login Data
app.post('/login', async (req, res) => {
    try {
        // Step A: Grab the email and password the user typed
        const { email, password } = req.body;

        // Step B: Look for the user in the database
        const user = await User.findOne({ email: email });
        
        // If no user is found with that email, stop right here
        if (!user) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Step C: The Verifier! Compare the typed password to the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // If the math doesn't match, the password is wrong
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Step D: SUCCESS! Hand them their VIP wristband (Session ID)
        req.session.userId = user._id;

        // Step E: Welcome them and send them into the restaurant (homepage)
        req.flash('success_msg', `Welcome back, ${user.name}!`);
        res.redirect('/'); 

    } catch (err) {
        console.error("Login Error:", err);
        req.flash('error_msg', 'An error occurred during login.');
        res.redirect('/login');
    }
});

// --- LOGOUT ROUTE ---
app.get('/logout', (req, res) => {
    // 1. Remove the user's ID to log them out
    req.session.userId = null; 

    // 2. Set the success message requested by your assignment!
    req.flash('success_msg', 'You have successfully logged out.');

    // 3. Redirect them to the Homepage instead of the Login page
    res.redirect('/');
});
// --- SECURITY MIDDLEWARE ---

// Guard 1: Checks if ANY user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        return next(); // They have a VIP wristband, let them through!
    }
    req.flash('error_msg', 'Please log in to access this page.');
    res.redirect('/login'); // No wristband? Kick to login.
};

// Guard 2: Checks if the logged-in user is an ADMIN
const isAdmin = async (req, res, next) => {
    // First, make sure they are logged in at all
    if (!req.session.userId) {
        req.flash('error_msg', 'Please log in first.');
        return res.redirect('/login');
    }

    try {
        // Look up the user in the database
        const user = await User.findById(req.session.userId);
        
        // Check their role!
        if (user && user.role === 'admin') {
            return next(); // They are the manager, let them into the Admin Panel!
        } else {
            req.flash('error_msg', 'Access Denied: Admins Only!');
            return res.redirect('/'); // Just a customer? Kick them to the homepage.
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};
// 7. Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kiko Milano Server is running at http://localhost:${PORT}`);
});