const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Set EJS & Static Files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kikoDB')
    .then(() => console.log('MongoDB Connected to Express Server'))
    .catch(err => console.log('Database connection error:', err));

// Security & Session Setup
app.use(session({
    secret: 'kiko_milano_super_secret_key', 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/kikoDB' 
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

// Initialize Flash & Global Variables Middleware
app.use(flash());
//custom middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.currentUser = req.session.userId || null;  // help in login or logout button
    res.locals.userRole = req.session.userRole || null;    //help in identify weather user or admin
    next(); 
});

// Route Traffic Control
app.use('/', productRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes); // This automatically prefixes all admin routes with /admin!

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kiko Milano Server is running at http://localhost:${PORT}`);
});