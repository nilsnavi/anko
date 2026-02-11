const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Заголовок обязателен'],
        trim: true,
        maxlength: [300, 'Заголовок не может превышать 300 символов']
    },
    summary: {
        type: String,
        required: [true, 'Краткое описание обязательно'],
        maxlength: [500, 'Краткое описание не может превышать 500 символов']
    },
    content: {
        type: String,
        maxlength: [5000, 'Содержание не может превышать 5000 символов']
    },
    category: {
        type: String,
        enum: ['News', 'Analytics', 'Event'],
        default: 'News'
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrl: {
        type: String
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes
newsSchema.index({ date: -1 });
newsSchema.index({ category: 1, date: -1 });
newsSchema.index({ isPublished: 1, date: -1 });

// Virtual for formatted date
newsSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
