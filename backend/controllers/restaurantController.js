const Restaurant = require('../models/Restaurant');

// Get all restaurants, with optional location filter
exports.getRestaurants = async (req, res) => {
    try {
        const filter = {};
        if (req.query.location) {
            filter.location = req.query.location;
        }
        const restaurants = await Restaurant.find(filter);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        const saved = await newRestaurant.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const deleted = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Restaurant not found' });
        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
