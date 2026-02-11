require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting_ecosystem';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Mongoose connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: NODE_ENV === 'production' ? CORS_ORIGIN : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check (no rate limiting)
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);

// API info endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'Accounting Ecosystem API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            content: '/api/content',
            media: '/api/media',
            health: '/health'
        }
    });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    mongoose.connection.close(false, () => {
        console.log('💤 MongoDB connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    mongoose.connection.close(false, () => {
        console.log('💤 MongoDB connection closed');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server started successfully');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

module.exports = app;
