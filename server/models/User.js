const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Имя пользователя обязательно'],
        unique: true,
        trim: true,
        minlength: [3, 'Имя пользователя должно содержать минимум 3 символа'],
        maxlength: [30, 'Имя пользователя не может превышать 30 символов']
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Некорректный формат email']
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [6, 'Пароль должен содержать минимум 6 символов']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshTokens: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 604800 // 7 days in seconds
        }
    }],
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Method to add refresh token
userSchema.methods.addRefreshToken = function(token) {
    this.refreshTokens.push({ token });
    return this.save();
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
    return this.save();
};

// Method to validate refresh token
userSchema.methods.hasRefreshToken = function(token) {
    return this.refreshTokens.some(rt => rt.token === token);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.refreshTokens;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
