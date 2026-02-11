const connectDB = require('./config/db');
const seedProducts = require('./seed');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const run = async () => {
    try {
        await connectDB();
        await seedProducts();
        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

run();
