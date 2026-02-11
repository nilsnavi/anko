const { verifyToken } = require('../utils/jwt');
const { AppError } = require('./errorHandler');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return next(new AppError('Access token обязателен', 401));
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('Пользователь не найден', 401));
        }

        // Attach user to request
        req.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };
        
        next();
    } catch (error) {
        next(new AppError('Неверный или истекший токен', 403));
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new AppError('Доступ запрещен. Требуются права администратора', 403));
    }
    next();
};

module.exports = authenticateToken;
module.exports.requireAdmin = requireAdmin;