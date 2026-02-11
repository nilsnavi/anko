const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true,
        maxlength: [100, 'Имя не может превышать 100 символов']
    },
    role: {
        type: String,
        required: [true, 'Должность обязательна'],
        trim: true,
        maxlength: [200, 'Должность не может превышать 200 символов']
    },
    imageUrl: {
        type: String,
        required: [true, 'URL изображения обязателен']
    },
    bio: {
        type: String,
        maxlength: [1000, 'Биография не может превышать 1000 символов']
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
    socialLinks: {
        telegram: String,
        vk: String,
        linkedin: String
    },
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

// Index for ordering
teamMemberSchema.index({ isActive: 1, order: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
