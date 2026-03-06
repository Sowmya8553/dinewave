const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Auto-create default admin for demo purposes if none exists
        const adminCount = await AdminUser.countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await AdminUser.create({ username: 'admin', password: hashedPassword });
        }

        const admin = await AdminUser.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.json({ token, username: admin.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
