const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя клиента обязательно'],
        trim: true,
        maxlength: [200, 'Имя не может превышать 200 символов']
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Некорректный формат email']
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true,
        maxlength: [200, 'Название компании не может превышать 200 символов']
    },
    inn: {
        type: String,
        trim: true,
        match: [/^\d{10,12}$/, 'ИНН должен содержать 10 или 12 цифр']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    contractNumber: {
        type: String,
        trim: true
    },
    contractDate: {
        type: Date
    },
    services: [{
        type: String
    }],
    notes: {
        type: String,
        maxlength: [2000, 'Примечания не могут превышать 2000 символов']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ company: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
