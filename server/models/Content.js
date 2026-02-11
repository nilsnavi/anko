const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Will store icon name/component name
    details: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const teamMemberSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const newsSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    category: {
        type: String,
        enum: ['News', 'Analytics', 'Event'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const faqSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const clientSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    phone: String,
    email: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'read', 'replied'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Models
const Service = mongoose.model('Service', serviceSchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const News = mongoose.model('News', newsSchema);
const FAQ = mongoose.model('FAQ', faqSchema);
const Client = mongoose.model('Client', clientSchema);
const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = {
    Service,
    TeamMember,
    News,
    FAQ,
    Client,
    Inquiry
};