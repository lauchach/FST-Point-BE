const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // สำหรับการจัดการ token (JWT)
const app = express();
const PORT = 4000; // พอร์ตที่เซิร์ฟเวอร์จะทำงาน

// Dummy user data
let user = {
    id: 1,
    name: 'John Doe',
    points: 100, // คะแนนที่มีอยู่
    redeemedProducts: [] // สินค้าที่แลกรับไปแล้ว
};

// Dummy product data
const products = [
    {
        id: 1,
        name: 'Discount 10%',
        description: 'Get a 10% discount on selected items',
        points: 50,
        image: 'https://via.placeholder.com/150',
        expiryDate: '2024-12-31',
        conditions: 'Valid for one-time use only',
    },
    {
        id: 2,
        name: 'Free Shipping',
        description: 'Enjoy free shipping for your next order',
        points: 30,
        image: 'https://via.placeholder.com/150',
        expiryDate: '2024-12-31',
        conditions: 'Valid on orders over $50',
    }
];

app.use(cors()); // เปิดให้ CORS เพื่อให้ Frontend เชื่อมต่อได้
app.use(bodyParser.json()); // ใช้ body-parser เพื่อดึงข้อมูลจาก request body

// ฟังก์ชัน Middleware สำหรับตรวจสอบ JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'secretkey', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(403).json({ message: 'No token provided' });
    }
};

// Route เพื่อดึงข้อมูลผู้ใช้งาน (ใช้ใน getUserInfo)
app.get('/api/user', verifyToken, (req, res) => {
    console.log('59', req.body)
    res.json({
        name: user.name,
        points: user.points
    });
});

// Route เพื่อดึงข้อมูลสินค้าทั้งหมด (ใช้ใน getProducts)
app.get('/api/products', verifyToken, (req, res) => {
    res.json({
        products: products
    });
});

// Route เพื่อดึงรายละเอียดสินค้าตาม ID (ใช้ใน getProductDetails)
app.get('/api/products/:id', verifyToken, (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json({
            ...product,
            userPoints: user.points,
            canRedeem: !user.redeemedProducts.includes(productId) // ตรวจสอบว่าสามารถแลกรับได้หรือไม่
        });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Route เพื่อแลกรับสิทธิ์ (ใช้ใน redeemProduct)
app.post('/api/products/:id/redeem', verifyToken, (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (user.points < product.points) {
        return res.status(400).json({ message: 'Insufficient points' });
    }

    if (user.redeemedProducts.includes(productId)) {
        return res.status(400).json({ message: 'Product already redeemed' });
    }

    // ลดคะแนนและบันทึกสินค้าที่แลกรับไปแล้ว
    user.points -= product.points;
    user.redeemedProducts.push(productId);

    res.json({
        message: 'Product redeemed successfully',
        points: user.points // ส่งคะแนนที่เหลือกลับไปยัง frontend
    });
});

// Route to get redeemed products
app.get('/api/redeemed-products', verifyToken, (req, res) => {
    const redeemedProducts = [
        { id: 1, name: 'Reward 1', description: 'Special offer 1', points: 50, redeemedDate: '2024-10-01' },
        { id: 2, name: 'Reward 2', description: 'Special offer 2', points: 30, redeemedDate: '2024-10-02' }
    ]; // Example redeemed data

    res.json(redeemedProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        points: product.points,
        redeemedDate: product.redeemedDate
    })));
});

// Route to get user profile
app.get('/api/user/profile', verifyToken, (req, res) => {
    console.log('75')
    res.json({
        name: user.name,
        email: user.email,
        points: user.points
    });
});

// Route to update user profile
app.put('/api/user/profile', verifyToken, (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    // Update user profile
    user.name = name;
    user.email = email;

    res.json({
        message: 'Profile updated successfully',
        name: user.name,
        email: user.email
    });
});

// Route สำหรับการล็อกอิน (กรณีที่ต้องการ)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        // สร้าง JWT token และส่งกลับไปยังผู้ใช้
        const token = jwt.sign({ id: user.id, name: user.name }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
