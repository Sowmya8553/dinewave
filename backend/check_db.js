require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dinewave').then(async () => {
    const restaurants = await Restaurant.find({}, { name: 1, location: 1, imageUrl: 1 });
    const menuCount = await MenuItem.countDocuments();
    console.log('Total Restaurants:', restaurants.length);
    console.log('Total Menu Items:', menuCount);
    restaurants.forEach(r => console.log(` - ${r.name} | ${r.location} | img: ${(r.imageUrl || '').substring(0, 60)}`));
    process.exit();
}).catch(err => { console.error(err.message); process.exit(1); });
