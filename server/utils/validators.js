/**
 * Validation rules for user registration and authentication
 */

const validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
};

const validateUsername = (username) => {
    // Username: 3-30 chars, alphanumeric and underscore
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return re.test(username);
};

const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

const validateRegisterInput = (username, email, password) => {
    const errors = {};

    if (!username || !username.trim()) {
        errors.username = 'Имя пользователя обязательно';
    } else if (!validateUsername(username)) {
        errors.username = 'Имя пользователя должно содержать 3-30 символов (буквы, цифры, подчёркивание)';
    }

    if (!email || !email.trim()) {
        errors.email = 'Email обязателен';
    } else if (!validateEmail(email)) {
        errors.email = 'Некорректный формат email';
    }

    if (!password) {
        errors.password = 'Пароль обязателен';
    } else if (!validatePassword(password)) {
        errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

const validateLoginInput = (username, password) => {
    const errors = {};

    if (!username || !username.trim()) {
        errors.username = 'Имя пользователя обязательно';
    }

    if (!password) {
        errors.password = 'Пароль обязателен';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    validateRegisterInput,
    validateLoginInput
};
