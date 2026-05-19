const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { verifyToken } = require('../middleware/apiAuth');

// --- PUBLIC ROUTES ---
router.post('/auth/login', apiController.login);
router.get('/products', apiController.getProducts);
router.get('/products/:id', apiController.getProductById);

// --- PROTECTED ROUTES ---
// The verifyToken middleware sits between the route and the controller
router.get('/user/profile', verifyToken, apiController.getUserProfile);
router.post('/orders', verifyToken, apiController.submitOrder);

module.exports = router;