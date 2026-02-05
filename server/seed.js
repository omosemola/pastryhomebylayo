const Product = require('../models/Product');

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});

        // Seed products
        const products = [
            {
                name: 'Banana Bread',
                price: 4.50,
                description: 'Moist and delicious homemade banana bread, baked fresh daily with ripe bananas and a hint of cinnamon.',
                image: './assets/products/banana_bread.png',
                badge: 'Top Seller',
                featured: true,
                category: 'Bread'
            },
            {
                name: 'Strawberry Tart',
                price: 6.00,
                description: 'Fresh strawberry tart with creamy vanilla custard filling and flaky pastry crust.',
                image: '',
                badge: 'New',
                featured: true,
                category: 'Tarts'
            },
            {
                name: 'Chocolate Eclair',
                price: 5.50,
                description: 'Classic French pastry filled with rich chocolate cream and topped with glossy chocolate glaze.',
                image: '',
                badge: 'Favorite',
                featured: true,
                category: 'Pastries'
            },
            {
                name: 'Pistachio Macaron',
                price: 3.00,
                description: 'Delicate almond meringue cookies with smooth pistachio buttercream filling.',
                image: '',
                badge: 'Must Try',
                featured: true,
                category: 'Macarons'
            },
            {
                name: 'Red Velvet Cake',
                price: 4.50,
                description: 'Classic red velvet cake with smooth cream cheese frosting, perfect for any occasion.',
                image: '',
                badge: 'Classic',
                featured: true,
                category: 'Cakes'
            },
            {
                name: 'Blueberry Muffin',
                price: 3.50,
                description: 'Fluffy blueberry muffins bursting with fresh blueberries and a buttery crumb topping.',
                image: '',
                badge: 'Fresh',
                featured: true,
                category: 'Muffins'
            },
            {
                name: 'Cinnamon Roll',
                price: 4.00,
                description: 'Soft, gooey cinnamon rolls with sweet cream cheese icing, baked to perfection.',
                image: '',
                badge: 'Warm',
                featured: true,
                category: 'Rolls'
            },
            {
                name: 'Fruit Danish',
                price: 5.00,
                description: 'Flaky Danish pastry filled with sweet cream cheese and topped with fresh seasonal fruit.',
                image: '',
                badge: 'Flaky',
                featured: true,
                category: 'Danish'
            }
        ];

        await Product.insertMany(products);
        console.log('✅ Products seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding products:', error.message);
    }
};

module.exports = seedProducts;
