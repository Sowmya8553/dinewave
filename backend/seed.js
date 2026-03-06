const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dinewave';

// ── All images are AI-generated, stored locally in /public/dishes/
// ── Restaurant images use stable Unsplash photo IDs (permanent, no redirect)
// ── Format: https://images.unsplash.com/photo-{ID}?w=800&q=80

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB...');
        console.log('Seeding: will ONLY add restaurants that do not already exist (existing data is preserved)...');

        const data = [

            // ═══════════════════════════════════════
            // CHENNAI
            // ═══════════════════════════════════════
            {
                restaurant: {
                    name: 'Buhari Restaurant',
                    location: 'Chennai',
                    address: 'Mount Road, Anna Salai, Chennai',
                    description: 'The legendary birthplace of Chicken 65, serving fine South Indian & Mughlai cuisine since 1951.',
                    cuisine: 'Mughlai, Multi-Cuisine',
                    rating: 4.5,
                    // Warm Indian dining hall — Unsplash photo-1517248135467 (restaurant interior)
                    imageUrl: '/restaurants/buhari.jpg'
                },
                menu: [
                    {
                        name: 'Chicken 65',
                        category: 'Starters',
                        price: 240,
                        description: 'The original Buhari Chicken 65 – crispy, spicy, deep-fried with curry leaves.',
                        imageUrl: '/dishes/dish_chicken65_1772758196718.png'
                    },
                    {
                        name: 'Mutton Biryani',
                        category: 'Main Course',
                        price: 350,
                        description: 'Fragrant dum-cooked basmati rice layered with spiced mutton.',
                        imageUrl: '/dishes/dish_mutton_biryani_1772758215046.png'
                    },
                    {
                        name: 'Butter Naan',
                        category: 'Main Course',
                        price: 50,
                        description: 'Soft leavened flatbread glazed with butter, baked in a tandoor.',
                        imageUrl: '/dishes/dish_butter_naan_1772758255279.png'
                    },
                    {
                        name: 'Mutton Seekh Kebab',
                        category: 'Starters',
                        price: 320,
                        description: 'Minced mutton mixed with spices, skewered and charcoal grilled.',
                        imageUrl: '/dishes/dish_seekh_kebab_1772758276546.png'
                    },
                    {
                        name: 'Gulab Jamun',
                        category: 'Desserts',
                        price: 90,
                        description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup.',
                        imageUrl: '/dishes/dish_gulab_jamun_1772758292017.png'
                    },
                    {
                        name: 'Masala Chai',
                        category: 'Drinks',
                        price: 40,
                        description: 'Freshly brewed Indian spiced tea with milk.',
                        // Unsplash: warm tea photo
                        imageUrl: 'https://images.unsplash.com/photo-1563822249366-3efb23b8ae99?w=500&q=80'
                    }
                ]
            },

            {
                restaurant: {
                    name: 'Murugan Idli Shop',
                    location: 'Chennai',
                    address: 'G.N. Chetty Road, T. Nagar, Chennai',
                    description: 'Famous across Tamil Nadu for its cloud-soft podi idlis and authentic tiffin variety.',
                    cuisine: 'South Indian Vegetarian',
                    rating: 4.7,
                    // South Indian banana leaf meal — Unsplash photo-1546069901
                    imageUrl: '/restaurants/murugan.jpg'
                },
                menu: [
                    {
                        name: 'Ghee Podi Idli',
                        category: 'Main Course',
                        price: 80,
                        description: 'Soft steamed idlis tossed in ghee and gunpowder spice.',
                        imageUrl: '/dishes/dish_idli_sambar_1772758321293.png'
                    },
                    {
                        name: 'Masala Dosa',
                        category: 'Main Course',
                        price: 95,
                        description: 'Crispy dosa filled with spiced potato masala, served with coconut chutney.',
                        imageUrl: '/dishes/dish_masala_dosa_1772758230194.png'
                    },
                    {
                        name: 'Medhu Vada',
                        category: 'Starters',
                        price: 60,
                        description: 'Crispy outside, fluffy inside – the classic lentil doughnut.',
                        imageUrl: '/dishes/dish_medu_vada_1772758336609.png'
                    },
                    {
                        name: 'Onion Uttapam',
                        category: 'Main Course',
                        price: 110,
                        description: 'Thick rice pancake loaded with diced onions and green chillies.',
                        // Unsplash: pancake / breakfast food
                        imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=80'
                    },
                    {
                        name: 'Filter Coffee',
                        category: 'Drinks',
                        price: 50,
                        description: 'Traditional South Indian filter coffee poured from height.',
                        imageUrl: '/dishes/dish_filter_coffee_1772758353608.png'
                    },
                    {
                        name: 'Rava Kesari',
                        category: 'Desserts',
                        price: 75,
                        description: 'Semolina pudding with saffron, ghee, and cashews.',
                        // Unsplash: orange-yellow halwa dessert
                        imageUrl: 'https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&q=80'
                    }
                ]
            },

            // ═══════════════════════════════════════
            // BANGALORE
            // ═══════════════════════════════════════
            {
                restaurant: {
                    name: 'Vidyarthi Bhavan',
                    location: 'Bangalore',
                    address: 'Gandhi Bazaar, Basavanagudi, Bangalore',
                    description: 'A heritage institution since 1943, celebrated for the crispiest Benne Masala Dosa in Bangalore.',
                    cuisine: 'South Indian Vegetarian',
                    rating: 4.8,
                    imageUrl: '/restaurants/vidyarthi.jpg'
                },
                menu: [
                    {
                        name: 'Benne Masala Dosa',
                        category: 'Main Course',
                        price: 120,
                        description: 'Bangalore iconic butter dosa cooked in pure white butter with potato filling.',
                        imageUrl: '/dishes/dish_masala_dosa_1772758230194.png'
                    },
                    {
                        name: 'Idli Sambar',
                        category: 'Main Course',
                        price: 70,
                        description: 'Steamed rice cakes served with piping-hot lentil sambar.',
                        imageUrl: '/dishes/dish_idli_sambar_1772758321293.png'
                    },
                    {
                        name: 'Rava Vada',
                        category: 'Starters',
                        price: 65,
                        description: 'Semolina vada with pepper and curry leaves – crisp and addictive.',
                        imageUrl: '/dishes/dish_medu_vada_1772758336609.png'
                    },
                    {
                        name: 'Poori Sagu',
                        category: 'Main Course',
                        price: 100,
                        description: 'Puffy deep-fried pooris with mixed vegetable sagu.',
                        // Unsplash: puffed bread / Indian bread
                        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80'
                    },
                    {
                        name: 'Filter Coffee',
                        category: 'Drinks',
                        price: 30,
                        description: 'Classic South Indian filter coffee.',
                        imageUrl: '/dishes/dish_filter_coffee_1772758353608.png'
                    },
                    {
                        name: 'Mysore Pak',
                        category: 'Desserts',
                        price: 80,
                        description: 'Ghee-rich gram flour sweet from the royal kitchens of Mysore.',
                        // Unsplash: Indian golden sweet
                        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80'
                    }
                ]
            },

            {
                restaurant: {
                    name: 'Truffles',
                    location: 'Bangalore',
                    address: '80 Feet Road, Koramangala, Bangalore',
                    description: 'Bangalore favourite burger and cafe joint – known for indulgent comfort food and great desserts.',
                    cuisine: 'Continental, American',
                    rating: 4.4,
                    // Unsplash: burger cafe
                    imageUrl: '/restaurants/truffles.jpg'
                },
                menu: [
                    {
                        name: 'Classic Beef Burger',
                        category: 'Main Course',
                        price: 310,
                        description: 'Juicy ground beef patty with cheddar, lettuce, tomato, and special sauce.',
                        imageUrl: '/dishes/dish_beef_burger_1772758409048.png'
                    },
                    {
                        name: 'Peri Peri Chicken Wings',
                        category: 'Starters',
                        price: 230,
                        description: 'Crispy wings marinated in spicy African peri peri sauce.',
                        imageUrl: '/dishes/dish_chicken_wings_1772758463432.png'
                    },
                    {
                        name: 'Pasta Alfredo',
                        category: 'Main Course',
                        price: 280,
                        description: 'Fettuccine in a rich parmesan and butter cream sauce.',
                        imageUrl: '/dishes/dish_pasta_alfredo_1772758433702.png'
                    },
                    {
                        name: 'New York Cheesecake',
                        category: 'Desserts',
                        price: 200,
                        description: 'Dense baked cheesecake with a buttery graham cracker crust.',
                        imageUrl: '/dishes/dish_cheesecake_1772758449142.png'
                    },
                    {
                        name: 'Cold Brew Coffee',
                        category: 'Drinks',
                        price: 150,
                        description: 'Slow-steeped smooth cold brew over ice.',
                        // Unsplash: iced coffee photo-1517701550927
                        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80'
                    },
                    {
                        name: 'Loaded Nachos',
                        category: 'Starters',
                        price: 250,
                        description: 'Tortilla chips loaded with jalapenos, salsa, sour cream, and cheese.',
                        // Unsplash: nachos photo
                        imageUrl: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=500&q=80'
                    }
                ]
            },

            // ═══════════════════════════════════════
            // HYDERABAD
            // ═══════════════════════════════════════
            {
                restaurant: {
                    name: 'Paradise Biryani',
                    location: 'Hyderabad',
                    address: 'MG Road, Secunderabad, Hyderabad',
                    description: 'Hyderabad most iconic biryani house, world-famous for its traditional Dum Biryani since 1953.',
                    cuisine: 'Hyderabadi, Mughlai',
                    rating: 4.6,
                    // Unsplash: Biryani in pot
                    imageUrl: '/restaurants/paradise.jpg'
                },
                menu: [
                    {
                        name: 'Chicken Dum Biryani',
                        category: 'Main Course',
                        price: 320,
                        description: 'The celebrated slow-cooked Hyderabadi dum biryani with whole spices.',
                        imageUrl: '/dishes/dish_hyderabadi_biryani_1772758376290.png'
                    },
                    {
                        name: 'Mutton Dum Biryani',
                        category: 'Main Course',
                        price: 400,
                        description: 'Tender mutton pieces layered in aromatic saffron basmati rice.',
                        imageUrl: '/dishes/dish_mutton_biryani_1772758215046.png'
                    },
                    {
                        name: 'Hyderabadi Haleem',
                        category: 'Starters',
                        price: 280,
                        description: 'Slow-cooked wheat and meat stew, rich with caramelised onions.',
                        imageUrl: '/dishes/dish_haleem_1772758393365.png'
                    },
                    {
                        name: 'Mirchi Ka Salan',
                        category: 'Main Course',
                        price: 130,
                        description: 'Hyderabadi green chilli curry – the traditional biryani accompaniment.',
                        // Unsplash: green curry
                        imageUrl: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=500&q=80'
                    },
                    {
                        name: 'Qubani Ka Meetha',
                        category: 'Desserts',
                        price: 120,
                        description: 'Classic Hyderabadi apricot dessert topped with cream.',
                        // Unsplash: apricot/fruit dessert bowl
                        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80'
                    },
                    {
                        name: 'Rooh Afza Sharbat',
                        category: 'Drinks',
                        price: 70,
                        description: 'Chilled rose-flavoured drink – a Hyderabadi summer staple.',
                        // Unsplash: pink rose drink photo-1546173159
                        imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a9f6ad?w=500&q=80'
                    }
                ]
            },

            {
                restaurant: {
                    name: 'Hotel Shadab',
                    location: 'Hyderabad',
                    address: 'High Court Road, near Charminar, Hyderabad',
                    description: 'An institution near the Charminar serving Mughlai breakfast, Nihari, and legendary Biryani.',
                    cuisine: 'Mughlai, Hyderabadi',
                    rating: 4.5,
                    imageUrl: '/restaurants/shadab.jpg'
                },
                menu: [
                    {
                        name: 'Nihari',
                        category: 'Main Course',
                        price: 380,
                        description: 'Slow-cooked overnight lamb shanks in a spiced broth.',
                        imageUrl: '/dishes/dish_nihari_1772758488079.png'
                    },
                    {
                        name: 'Shami Kebab',
                        category: 'Starters',
                        price: 220,
                        description: 'Soft minced mutton and chana dal patties, pan-fried.',
                        imageUrl: '/dishes/dish_seekh_kebab_1772758276546.png'
                    },
                    {
                        name: 'Hyderabadi Haleem',
                        category: 'Starters',
                        price: 260,
                        description: 'GI-tagged Hyderabadi haleem with caramelised onions and lime.',
                        imageUrl: '/dishes/dish_haleem_1772758393365.png'
                    },
                    {
                        name: 'Chicken Biryani',
                        category: 'Main Course',
                        price: 300,
                        description: 'Shadab house-style layered dum biryani with saffron.',
                        imageUrl: '/dishes/dish_hyderabadi_biryani_1772758376290.png'
                    },
                    {
                        name: 'Double Ka Meetha',
                        category: 'Desserts',
                        price: 130,
                        description: 'Fried bread slices soaked in saffron-cardamom syrup with cream.',
                        // Unsplash: rich Indian dessert
                        imageUrl: 'https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&q=80'
                    },
                    {
                        name: 'Irani Chai',
                        category: 'Drinks',
                        price: 30,
                        description: 'Hyderabad iconic milky slow-brewed Irani tea.',
                        imageUrl: 'https://images.unsplash.com/photo-1563822249366-3efb23b8ae99?w=500&q=80'
                    }
                ]
            },

            // ═══════════════════════════════════════
            // COIMBATORE
            // ═══════════════════════════════════════
            {
                restaurant: {
                    name: 'Sree Annapoorna',
                    location: 'Coimbatore',
                    address: '19 East Arokiasamy Road, RS Puram, Coimbatore',
                    description: 'Coimbatore beloved vegetarian restaurant since 1947, known for its distinct flavour.',
                    cuisine: 'South Indian Vegetarian',
                    rating: 4.9,
                    imageUrl: '/restaurants/annapoorna.jpg'
                },
                menu: [
                    {
                        name: 'Annapoorna Special Meals',
                        category: 'Main Course',
                        price: 200,
                        description: 'Full vegetarian thali on banana leaf with 15+ authentic items.',
                        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
                    },
                    {
                        name: 'Masala Dosa',
                        category: 'Main Course',
                        price: 95,
                        description: 'Extra-crispy dosa with Annapoorna signature masala.',
                        imageUrl: '/dishes/dish_masala_dosa_1772758230194.png'
                    },
                    {
                        name: 'Sambar Vada',
                        category: 'Starters',
                        price: 70,
                        description: 'Crispy vadas dunked in hot, freshly made sambar.',
                        imageUrl: '/dishes/dish_medu_vada_1772758336609.png'
                    },
                    {
                        name: 'Poori Masala',
                        category: 'Main Course',
                        price: 90,
                        description: 'Three golden-puffed pooris with rich potato masala.',
                        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80'
                    },
                    {
                        name: 'Filter Coffee',
                        category: 'Drinks',
                        price: 45,
                        description: 'Strong Coimbatore-style filter coffee with frothy milk.',
                        imageUrl: '/dishes/dish_filter_coffee_1772758353608.png'
                    },
                    {
                        name: 'Kesari Halwa',
                        category: 'Desserts',
                        price: 80,
                        description: 'Slow-cooked semolina halwa with ghee and dry fruits.',
                        imageUrl: 'https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=500&q=80'
                    }
                ]
            },

            {
                restaurant: {
                    name: 'Hari Bhavanam',
                    location: 'Coimbatore',
                    address: 'Avinashi Road, Peelamedu, Coimbatore',
                    description: 'A legendary name for Kongu Nadu non-vegetarian cuisine with generation-old family recipes.',
                    cuisine: 'Kongu Nadu, Non-Veg',
                    rating: 4.4,
                    imageUrl: '/restaurants/hari_bhavanam.jpg'
                },
                menu: [
                    {
                        name: 'Pallipalayam Chicken',
                        category: 'Main Course',
                        price: 290,
                        description: 'Kongu signature dry chicken with whole red chilies and shallots.',
                        imageUrl: '/dishes/dish_pallipalayam_chicken_1772758503510.png'
                    },
                    {
                        name: 'Mutton Chukka',
                        category: 'Starters',
                        price: 360,
                        description: 'Semi-dry mutton fry with pepper, coconut and curry leaves.',
                        // Unsplash: dry mutton fry
                        imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=500&q=80'
                    },
                    {
                        name: 'Chicken Chettinad Curry',
                        category: 'Main Course',
                        price: 310,
                        description: 'Bold Chettinad spiced chicken curry – one of India most celebrated.',
                        imageUrl: '/dishes/dish_chettinad_chicken_1772758479000.png'
                    },
                    {
                        name: 'Bun Parotta',
                        category: 'Main Course',
                        price: 50,
                        description: 'Flaky layered parotta, the perfect curry companion.',
                        imageUrl: '/dishes/dish_butter_naan_1772758255279.png'
                    },
                    {
                        name: 'Elaneer Payasam',
                        category: 'Desserts',
                        price: 130,
                        description: 'Tender coconut pudding with fresh cream and jelly.',
                        // Unsplash: coconut pudding dessert
                        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80'
                    },
                    {
                        name: 'Nannari Sarbath',
                        category: 'Drinks',
                        price: 60,
                        description: 'Refreshing Indian sarsaparilla sharbat – a Kongu Nadu classic.',
                        imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a9f6ad?w=500&q=80'
                    }
                ]
            }
        ];

        let added = 0;
        let skipped = 0;
        for (const entry of data) {
            // Check if this restaurant already exists by name
            const exists = await Restaurant.findOne({ name: entry.restaurant.name });
            if (exists) {
                console.log(`⏭️  Skipped (already exists): ${entry.restaurant.name}`);
                skipped++;
                continue;
            }
            const restaurant = await Restaurant.create(entry.restaurant);
            console.log(`✅ Added: ${restaurant.name} (${restaurant.location})`);
            for (const item of entry.menu) {
                await MenuItem.create({ ...item, restaurantId: restaurant._id });
                console.log(`   + ${item.name}`);
            }
            added++;
        }
        console.log(`\n📊 Summary: ${added} new restaurants added, ${skipped} already existed (preserved).`);

        console.log('🎉 Done! Existing data untouched, new data added.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
