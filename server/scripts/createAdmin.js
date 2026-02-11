const User = require('../models/User');

/**
 * Script to create initial admin user
 * Run with: node scripts/createAdmin.js
 */

const createAdminUser = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Username:', existingAdmin.username);
            console.log('Email:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            username: 'admin',
            email: 'admin@ecosystem-pbs.ru',
            password: 'admin123', // Will be hashed automatically
            role: 'admin'
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('----------------------------------------');
        console.log('Username: admin');
        console.log('Email: admin@ecosystem-pbs.ru');
        console.log('Password: admin123');
        console.log('----------------------------------------');
        console.log('⚠️  ВАЖНО: Измените пароль после первого входа!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

// Connect to MongoDB and create admin
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting_ecosystem';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('📊 Connected to MongoDB');
        return createAdminUser();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
