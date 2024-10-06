const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware.js');
const userController = require('../controllers/userController');

router.get('/', verifyToken, userController.getUserInfo);
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.get('/redeemedProducts', verifyToken, userController.getRedeemedProducts);

module.exports = router;
