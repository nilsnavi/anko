const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting_ecosystem';

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Test basic operations
        const testSchema = new mongoose.Schema({
            name: String,
            createdAt: { type: Date, default: Date.now }
        });

        const TestModel = mongoose.model('Test', testSchema);

        // Insert test document
        const testDoc = new TestModel({ name: 'Connection Test' });
        await testDoc.save();
        console.log('✅ Successfully inserted test document');

        // Query test document
        const foundDoc = await TestModel.findOne({ name: 'Connection Test' });
        console.log('✅ Successfully queried test document:', foundDoc.name);

        // Clean up
        await TestModel.deleteMany({ name: 'Connection Test' });
        console.log('✅ Cleaned up test data');

        await mongoose.connection.close();
        console.log('✅ Connection closed');

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();