const crypto = require('crypto');

/**
 * Generate random token for password reset
 * @returns {String} Random hex token
 */
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash reset token for secure storage
 * @param {String} token - Reset token to hash
 * @returns {String} Hashed token
 */
const hashResetToken = (token) => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
};

module.exports = {
    generateResetToken,
    hashResetToken
};
