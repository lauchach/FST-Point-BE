const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        console.log(6)
        jwt.verify(token, 'secretkey', (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Unauthorized' });
            req.user = decoded;
            next();
        });
    } else {
        console.log(13)
        return res.status(403).json({ message: 'No token provided' });
    }
};
