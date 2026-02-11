const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Generate access token
 * @param {Object} payload - User data to include in token
 * @returns {String} JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to include in token
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
};
