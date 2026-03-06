const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // will be hashed
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
