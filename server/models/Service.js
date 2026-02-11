const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Название услуги обязательно'],
        trim: true,
        maxlength: [200, 'Название не может превышать 200 символов']
    },
    description: {
        type: String,
        required: [true, 'Описание обязательно'],
        maxlength: [1000, 'Описание не может превышать 1000 символов']
    },
    icon: {
        type: String,
        required: true,
        default: 'FileText'
    },
    details: [{
        type: String,
        maxlength: 500
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
serviceSchema.index({ serviceId: 1 });
serviceSchema.index({ isActive: 1, order: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
