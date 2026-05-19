const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/upload');
const { isAdmin } = require('../middleware/authGuard');

router.get('/', isAdmin, adminController.getDashboard);
router.get('/product/add', isAdmin, adminController.getAddProduct);
// Renders the Sales Dashboard page (Protected by isAdmin middleware)
router.get('/sales', isAdmin, adminController.getSalesDashboard);

router.post('/product/add', isAdmin, upload.single('image'), adminController.postAddProduct);
router.get('/product/edit/:id', isAdmin, adminController.getEditProduct);
router.post('/product/edit/:id', isAdmin, upload.single('image'), adminController.postEditProduct);
router.post('/product/delete/:id', isAdmin, adminController.postDeleteProduct);

module.exports = router;