const productService = require('../services/productService');

exports.getProducts = (req, res) => {
    const products = productService.getAllProducts();
    res.json({ products });
};

exports.getProductDetails = (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productService.getProductById(productId, req.user);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.redeemProduct = (req, res) => {
    const productId = parseInt(req.params.id);
    const result = productService.redeemProduct(productId, req.user);

    if (result.success) {
        res.json({ message: 'Product redeemed successfully', points: result.points });
    } else {
        res.status(result.status).json({ message: result.message });
    }
};
