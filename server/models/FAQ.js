const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Вопрос обязателен'],
        trim: true,
        maxlength: [500, 'Вопрос не может превышать 500 символов']
    },
    answer: {
        type: String,
        required: [true, 'Ответ обязателен'],
        maxlength: [2000, 'Ответ не может превышать 2000 символов']
    },
    category: {
        type: String,
        trim: true,
        default: 'Общие'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
faqSchema.index({ isPublished: 1, order: 1 });
faqSchema.index({ category: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;
