const userService = require('../services/userService');

exports.getUserInfo = (req, res) => {
    const userInfo = userService.getUserInfo(req.user);
    res.json(userInfo);
};

exports.getUserProfile = (req, res) => {
    console.log('getUserProfile')
    const profile = userService.getUserProfile(req.user);
    res.json(profile);
};

exports.updateUserProfile = (req, res) => {
    const { name, email } = req.body;
    const updatedProfile = userService.updateUserProfile(req.user, { name, email });
    res.json(updatedProfile);
};

exports.getRedeemedProducts = (req, res) => {
    console.log(20)
    const redeemedProducts = userService.getRedeemedProducts(req.user);
    res.json(redeemedProducts);
};
