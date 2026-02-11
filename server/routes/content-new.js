const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const News = require('../models/News');
const TeamMember = require('../models/TeamMember');
const FAQ = require('../models/FAQ');
const Client = require('../models/Client');
const Inquiry = require('../models/Inquiry');
const authenticateToken = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');

// ===================
// SERVICES ENDPOINTS
// ===================

/**
 * @route   GET /api/content/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/services', catchAsync(async (req, res) => {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
}));

/**
 * @route   GET /api/content/services/:id
 * @desc    Get service by ID
 * @access  Public
 */
router.get('/services/:id', catchAsync(async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return next(new AppError('Услуга не найдена', 404));
    }
    res.json(service);
}));

/**
 * @route   PUT /api/content/services/:serviceId
 * @desc    Update service
 * @access  Private/Admin
 */
router.put('/services/:serviceId', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const { title, description, details } = req.body;
    
    const service = await Service.findOneAndUpdate(
        { serviceId: req.params.serviceId },
        { title, description, details },
        { new: true, runValidators: true }
    );

    if (!service) {
        return next(new AppError('Услуга не найдена', 404));
    }

    res.json(service);
}));

// ===================
// TEAM ENDPOINTS
// ===================

/**
 * @route   GET /api/content/team
 * @desc    Get all team members
 * @access  Public
 */
router.get('/team', catchAsync(async (req, res) => {
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    res.json(team);
}));

/**
 * @route   POST /api/content/team
 * @desc    Add team member
 * @access  Private/Admin
 */
router.post('/team', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const teamMember = new TeamMember(req.body);
    await teamMember.save();
    res.status(201).json(teamMember);
}));

/**
 * @route   PUT /api/content/team/:id
 * @desc    Update team member
 * @access  Private/Admin
 */
router.put('/team/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const teamMember = await TeamMember.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!teamMember) {
        return next(new AppError('Член команды не найден', 404));
    }

    res.json(teamMember);
}));

/**
 * @route   DELETE /api/content/team/:id
 * @desc    Delete team member
 * @access  Private/Admin
 */
router.delete('/team/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
        return next(new AppError('Член команды не найден', 404));
    }

    res.json({ message: 'Член команды удален' });
}));

// ===================
// NEWS ENDPOINTS
// ===================

/**
 * @route   GET /api/content/news
 * @desc    Get all published news
 * @access  Public
 */
router.get('/news', catchAsync(async (req, res) => {
    const { limit = 10, page = 1, category } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;

    const news = await News.find(query)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('author', 'username email');

    const total = await News.countDocuments(query);

    res.json({
        news,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
}));

/**
 * @route   GET /api/content/news/:id
 * @desc    Get news by ID
 * @access  Public
 */
router.get('/news/:id', catchAsync(async (req, res, next) => {
    const news = await News.findById(req.params.id).populate('author', 'username email');
    
    if (!news) {
        return next(new AppError('Новость не найдена', 404));
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
}));

/**
 * @route   POST /api/content/news
 * @desc    Create news
 * @access  Private/Admin
 */
router.post('/news', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const newsItem = new News({
        ...req.body,
        author: req.user.id
    });
    await newsItem.save();
    res.status(201).json(newsItem);
}));

/**
 * @route   PUT /api/content/news/:id
 * @desc    Update news
 * @access  Private/Admin
 */
router.put('/news/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const newsItem = await News.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!newsItem) {
        return next(new AppError('Новость не найдена', 404));
    }

    res.json(newsItem);
}));

/**
 * @route   DELETE /api/content/news/:id
 * @desc    Delete news
 * @access  Private/Admin
 */
router.delete('/news/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const newsItem = await News.findByIdAndDelete(req.params.id);

    if (!newsItem) {
        return next(new AppError('Новость не найдена', 404));
    }

    res.json({ message: 'Новость удалена' });
}));

// ===================
// FAQ ENDPOINTS
// ===================

/**
 * @route   GET /api/content/faq
 * @desc    Get all published FAQ
 * @access  Public
 */
router.get('/faq', catchAsync(async (req, res) => {
    const { category } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;

    const faq = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.json(faq);
}));

/**
 * @route   POST /api/content/faq
 * @desc    Create FAQ
 * @access  Private/Admin
 */
router.post('/faq', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const faqItem = new FAQ(req.body);
    await faqItem.save();
    res.status(201).json(faqItem);
}));

/**
 * @route   PUT /api/content/faq/:id
 * @desc    Update FAQ
 * @access  Private/Admin
 */
router.put('/faq/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const faqItem = await FAQ.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!faqItem) {
        return next(new AppError('FAQ не найден', 404));
    }

    res.json(faqItem);
}));

/**
 * @route   DELETE /api/content/faq/:id
 * @desc    Delete FAQ
 * @access  Private/Admin
 */
router.delete('/faq/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const faqItem = await FAQ.findByIdAndDelete(req.params.id);

    if (!faqItem) {
        return next(new AppError('FAQ не найден', 404));
    }

    res.json({ message: 'FAQ удален' });
}));

// ===================
// CLIENTS ENDPOINTS (Admin only)
// ===================

/**
 * @route   GET /api/content/clients
 * @desc    Get all clients
 * @access  Private/Admin
 */
router.get('/clients', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const { status, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } }
        ];
    }

    const clients = await Client.find(query)
        .sort({ createdAt: -1 })
        .populate('assignedTo', 'username email');

    res.json(clients);
}));

/**
 * @route   POST /api/content/clients
 * @desc    Create client
 * @access  Private/Admin
 */
router.post('/clients', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const client = new Client({
        ...req.body,
        assignedTo: req.user.id
    });
    await client.save();
    res.status(201).json(client);
}));

/**
 * @route   PUT /api/content/clients/:id
 * @desc    Update client
 * @access  Private/Admin
 */
router.put('/clients/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const client = await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!client) {
        return next(new AppError('Клиент не найден', 404));
    }

    res.json(client);
}));

/**
 * @route   DELETE /api/content/clients/:id
 * @desc    Delete client
 * @access  Private/Admin
 */
router.delete('/clients/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
        return next(new AppError('Клиент не найден', 404));
    }

    res.json({ message: 'Клиент удален' });
}));

// ===================
// INQUIRIES ENDPOINTS
// ===================

/**
 * @route   GET /api/content/inquiries
 * @desc    Get all inquiries
 * @access  Private/Admin
 */
router.get('/inquiries', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
    const { status, priority } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const inquiries = await Inquiry.find(query)
        .sort({ createdAt: -1 })
        .populate('assignedTo', 'username email');

    res.json(inquiries);
}));

/**
 * @route   POST /api/content/inquiries
 * @desc    Create inquiry (public form submission)
 * @access  Public
 */
router.post('/inquiries', catchAsync(async (req, res) => {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ 
        message: 'Ваше обращение принято. Мы свяжемся с вами в ближайшее время.',
        id: inquiry._id 
    });
}));

/**
 * @route   PUT /api/content/inquiries/:id
 * @desc    Update inquiry status/notes
 * @access  Private/Admin
 */
router.put('/inquiries/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const updateData = { ...req.body };
    
    // If marking as resolved, set resolvedAt
    if (updateData.status === 'resolved' || updateData.status === 'closed') {
        updateData.resolvedAt = new Date();
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!inquiry) {
        return next(new AppError('Обращение не найдено', 404));
    }

    res.json(inquiry);
}));

/**
 * @route   DELETE /api/content/inquiries/:id
 * @desc    Delete inquiry
 * @access  Private/Admin
 */
router.delete('/inquiries/:id', authenticateToken, requireAdmin, catchAsync(async (req, res, next) => {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
        return next(new AppError('Обращение не найдено', 404));
    }

    res.json({ message: 'Обращение удалено' });
}));

module.exports = router;
