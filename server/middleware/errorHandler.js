/**
 * Error handling middleware
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production: don't leak error details
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Log error for debugging
            console.error('ERROR 💥', err);
            
            res.status(500).json({
                status: 'error',
                message: 'Что-то пошло не так!'
            });
        }
    }
};

// Handle 404 errors
const notFound = (req, res, next) => {
    const error = new AppError(`Маршрут ${req.originalUrl} не найден`, 404);
    next(error);
};

// Async error wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    notFound,
    catchAsync
};
