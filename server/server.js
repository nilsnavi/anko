require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting_ecosystem';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(cors({
    origin: true, // Разрешить все origins в режиме разработки
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Mock database (в реальном приложении использовать настоящую БД)
const users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@ecosystem-pbs.ru',
        password: '$2a$10$VuP1KYoc5kobItXCI4mPSOE1izTNSgzsfj0MarfhuVDZbcePrqcAi', // hashed 'admin123'
        role: 'admin'
    }
];

// Password reset tokens (в реальном приложении использовать БД)
const passwordResetTokens = new Map();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = users.find(u => u.username === username);
        console.log('Found user:', user ? 'Yes' : 'No');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        console.log('Comparing passwords...');
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, role: users.find(u => u.id === user.id)?.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ accessToken });
    });
});

app.post('/api/auth/logout', (req, res) => {
    // In a real application, you would invalidate the token here
    res.json({ message: 'Logged out successfully' });
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        if (users.find(u => u.username === username)) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        if (users.find(u => u.email === email)) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            role: 'admin' // Make all new users admins for demo purposes
        };

        users.push(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            message: 'User registered successfully as admin'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Password reset request
app.post('/api/auth/reset-password/request', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            // Don't reveal if email exists for security
            return res.json({ message: 'If email exists, reset instructions sent' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store token (in real app, send email)
        passwordResetTokens.set(user.id, {
            token: resetToken,
            expiresAt: Date.now() + 3600000 // 1 hour
        });

        // In real application, send email with reset link
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.json({
            message: 'If email exists, reset instructions sent',
            // For demo purposes, we return token (remove in production)
            debugToken: resetToken
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Password reset confirm
app.post('/api/auth/reset-password/confirm', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Check if token exists and is valid
        const tokenData = passwordResetTokens.get(decoded.userId);
        if (!tokenData || tokenData.token !== token || tokenData.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Find user
        const user = users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Remove used token
        passwordResetTokens.delete(decoded.userId);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset confirm error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected routes
app.get('/api/admin/profile', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    });
});

// Content management routes
const contentRoutes = require('./routes/content');
app.use('/api/content', contentRoutes);

// Media management routes
const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Development: Get all users (REMOVE IN PRODUCTION)
app.get('/api/users', (req, res) => {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }));
    res.json(usersWithoutPasswords);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});