const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: {
        type: String,
        enum: ['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore'],
        required: true
    },
    address: { type: String, required: true },
    description: { type: String, required: true },
    cuisine: { type: String, default: 'Multi-Cuisine' },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
