require('dotenv').config(); // Loads the .env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path'); 

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');

// 1. Body Parsers (MUST be before routes)
app.use(express.json()); // For API JSON payloads
app.use(express.urlencoded({ extended: true })); // For traditional HTML form submissions

// 2. Set EJS & Static Files (Layouts removed!)
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. Mount Headless API Routes
app.use('/api/v1', apiRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kikoDB')
    .then(() => console.log('MongoDB Connected to Express Server'))
    .catch(err => console.log('Database connection error:', err));

// 4. Security & Session Setup
app.use(session({
    secret: 'kiko_milano_super_secret_key', 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1:27017/kikoDB' 
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

// 5. Initialize Flash & Global Variables Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.currentUser = req.session.userId || null;  
    res.locals.userRole = req.session.userRole || null;    
    next(); 
});

// 6. Traditional Route Traffic Control
app.use('/', productRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kiko Milano Server is running at http://localhost:${PORT}`);
});