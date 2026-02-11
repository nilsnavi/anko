const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { generateResetToken, hashResetToken } = require('../utils/crypto');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { authLimiter, registerLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const authenticateToken = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registerLimiter, catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate input
    const { errors, isValid } = validateRegisterInput(username, email, password);
    if (!isValid) {
        return next(new AppError(Object.values(errors).join(', '), 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
        if (existingUser.username === username) {
            return next(new AppError('Пользователь с таким именем уже существует', 409));
        }
        return next(new AppError('Пользователь с таким email уже существует', 409));
    }

    // Create new user
    const user = new User({
        username,
        email: email.toLowerCase(),
        password,
        role: 'admin' // First user is admin, or configure as needed
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
        id: user._id,
        username: user.username,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: user._id,
        username: user.username
    });

    // Save refresh token
    await user.addRefreshToken(refreshToken);

    res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        accessToken,
        refreshToken,
        user: user.toJSON()
    });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    // Validate input
    const { errors, isValid } = validateLoginInput(username, password);
    if (!isValid) {
        return next(new AppError(Object.values(errors).join(', '), 400));
    }

    // Find user
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
        return next(new AppError('Неверные учетные данные', 401));
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return next(new AppError('Неверные учетные данные', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
        id: user._id,
        username: user.username,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        id: user._id,
        username: user.username
    });

    // Save refresh token
    await user.addRefreshToken(refreshToken);

    res.json({
        accessToken,
        refreshToken,
        user: user.toJSON()
    });
}));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token обязателен', 401));
    }

    // Verify token
    let decoded;
    try {
        decoded = verifyToken(refreshToken);
    } catch (error) {
        return next(new AppError('Неверный или истекший refresh token', 403));
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user || !user.hasRefreshToken(refreshToken)) {
        return next(new AppError('Неверный refresh token', 403));
    }

    // Generate new access token
    const accessToken = generateAccessToken({
        id: user._id,
        username: user.username,
        role: user.role
    });

    res.json({ accessToken });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        try {
            const decoded = verifyToken(refreshToken);
            const user = await User.findById(decoded.id);
            if (user) {
                await user.removeRefreshToken(refreshToken);
            }
        } catch (error) {
            // Token might be invalid, but we still return success
        }
    }

    res.json({ message: 'Выход выполнен успешно' });
}));

/**
 * @route   POST /api/auth/reset-password/request
 * @desc    Request password reset
 * @access  Public
 */
router.post('/reset-password/request', passwordResetLimiter, catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email обязателен', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
        return res.json({
            message: 'Если email существует, инструкции отправлены'
        });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);

    // Save hashed token to database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    // await sendEmail(user.email, 'Password Reset', resetUrl);

    console.log(`🔑 Password reset token for ${email}: ${resetToken}`);

    res.json({
        message: 'Если email существует, инструкции отправлены',
        // ONLY for development - remove in production
        ...(process.env.NODE_ENV === 'development' && { debugToken: resetToken })
    });
}));

/**
 * @route   POST /api/auth/reset-password/confirm
 * @desc    Confirm password reset
 * @access  Public
 */
router.post('/reset-password/confirm', catchAsync(async (req, res, next) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return next(new AppError('Token и новый пароль обязательны', 400));
    }

    if (newPassword.length < 6) {
        return next(new AppError('Пароль должен содержать минимум 6 символов', 400));
    }

    // Hash token and find user
    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Неверный или истекший токен', 400));
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Remove all refresh tokens (force re-login)
    user.refreshTokens = [];
    
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
        return next(new AppError('Пользователь не найден', 404));
    }

    res.json(user.toJSON());
}));

module.exports = router;
