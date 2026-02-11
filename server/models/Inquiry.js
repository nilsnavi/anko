const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true,
        maxlength: [200, 'Имя не может превышать 200 символов']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Некорректный формат email']
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Тема обращения обязательна'],
        trim: true,
        maxlength: [300, 'Тема не может превышать 300 символов']
    },
    message: {
        type: String,
        required: [true, 'Сообщение обязательно'],
        maxlength: [2000, 'Сообщение не может превышать 2000 символов']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    source: {
        type: String,
        enum: ['website', 'email', 'phone', 'other'],
        default: 'website'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String,
        maxlength: [2000, 'Примечания не могут превышать 2000 символов']
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ priority: 1, status: 1 });

// Virtual for formatted date
inquirySchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
