const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const productController = require('../controllers/productController');

router.get('/', verifyToken, productController.getProducts);
router.get('/:id', verifyToken, productController.getProductDetails);
router.post('/:id/redeem', verifyToken, productController.redeemProduct);

module.exports = router;
