const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const adminController = require('../controllers/adminController'); // ✨ ADD THIS IMPORT
const { verifyToken } = require('../middleware/apiAuth');

// --- PUBLIC ROUTES ---
router.post('/auth/login', apiController.login);
router.get('/products', apiController.getProducts);
router.get('/products/:id', apiController.getProductById);

// ✨ ADD THIS NEW ROUTE FOR YOUR SALES DASHBOARD POLLING ✨
// Note: We leave it public or use session auth since the dashboard jQuery calls it directly
router.get('/sales-data', adminController.getLiveSalesData); 

// --- PROTECTED ROUTES ---
router.get('/user/profile', verifyToken, apiController.getUserProfile);
router.post('/orders', verifyToken, apiController.submitOrder);

module.exports = router;