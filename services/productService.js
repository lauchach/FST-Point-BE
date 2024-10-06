const userService = require('../services/userService');

    const user = userService.mockUser()
    // const redeemedProduct =  userService.mockRedeemedProducts()

const products = [
    { id: 1, name: 'Discount 10%', description: 'Get a 10% discount', points: 50, redeemedDate: '2024-10-01' },
    { id: 2, name: 'Free Shipping', description: 'Free shipping', points: 30, redeemedDate: '2024-10-02'}
];

exports.getAllProducts = () => products;

exports.getProductById = (productId) => {
    console.log(16, productId)
    const product = products.find(p => p.id === productId);
    console.log(18, product)
    if (product) {
        return {
            ...product,
            userPoints: user.points,
            canRedeem: !user.redeemedProducts.includes(productId)
        };
    }
    return null;
};

exports.redeemProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, status: 404, message: 'Product not found' };
    if (user.points < product.points) return { success: false, status: 400, message: 'Insufficient points' };
    if (user.redeemedProducts.includes(productId)) return { success: false, status: 400, message: 'Product already redeemed' };
    user.points -= product.points;
    user.redeemedProducts.push(product);
    return { success: true, points: user.points };
};
