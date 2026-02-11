const rateLimit = require('express-rate-limit');

/**
 * Rate limiting configurations for different endpoints
 */

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Слишком много запросов с этого IP, попробуйте позже',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth endpoints rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Слишком много попыток входа, попробуйте через 15 минут',
    skipSuccessfulRequests: true, // Don't count successful requests
    standardHeaders: true,
    legacyHeaders: false,
});

// Registration rate limiter
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registrations per hour
    message: 'Слишком много регистраций с этого IP',
    standardHeaders: true,
    legacyHeaders: false,
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 reset attempts per hour
    message: 'Слишком много попыток сброса пароля',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    registerLimiter,
    passwordResetLimiter
};
