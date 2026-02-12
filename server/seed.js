const Product = require('./models/Product');

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});

        // Seed products
        const products = [
            {
                name: 'Banana Bread',
                price: 9500,
                image: './assets/products/banana_bread.png',
                badge: 'Top Seller',
                featured: true,
                category: 'Bread',
                rating: 4.8
            },
            {
                name: 'Small Chops',
                price: 8000,
                image: './assets/products/smallchops_big.png',
                badge: 'Favorite',
                featured: true,
                category: 'Pastry'
            },
            {
                name: 'Vanilla Cake',
                price: 7000,
                image: './assets/products/vanilla_cake.png',
                badge: 'Favorite',
                featured: true,
                category: 'Cake'
            },
            {
                name: 'Red Velvet Cake',
                price: 7000,
                image: './assets/products/redvelvet_cake.png',
                badge: 'Must Try',
                featured: true,
                category: 'Cake'
            },
            {
                name: 'Chocolate Cake',
                price: 7000,
                image: './assets/products/chocolate_cake.png',
                badge: 'Classic',
                featured: true,
                category: 'Cake'
            },
            {
                name: 'Meat Pie',
                price: 5000,
                image: './assets/products/meat_pie.png',
                badge: 'Fresh',
                featured: true,
                category: 'Pastry',
                rating: 4.8
            },
            {
                name: 'Chin Chin',
                price: 2500,
                image: './assets/products/chin_chin.png',
                badge: 'Crunchy',
                featured: true,
                category: 'Pastry'
            },
            {
                name: 'Cheese Steak',
                price: 10000,
                image: './assets/products/cheese_steak.png',
                badge: 'Must Try',
                featured: true,
                category: 'Pastry'
            }
        ];

        await Product.insertMany(products);
        console.log('✅ Products seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding products:', error.message);
    }
};

module.exports = seedProducts;
