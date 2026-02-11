const express = require('express');
const router = express.Router();
const db = require('../db/in-memory');
const { authenticateToken } = require('../middleware/auth');

// Services endpoints
router.get('/services', (req, res) => {
    try {
        const services = db.getServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
});

router.put('/services/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('services', { id }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating service' });
    }
});

// Team members endpoints
router.get('/team', (req, res) => {
    try {
        const team = db.getTeamMembers();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team members' });
    }
});

router.post('/team', authenticateToken, (req, res) => {
    try {
        const newMember = db.insertOne('teamMembers', req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: 'Error adding team member' });
    }
});

router.put('/team/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('teamMembers', { id: parseInt(id) }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating team member' });
    }
});

router.delete('/team/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const deleted = db.deleteOne('teamMembers', { id: parseInt(id) });

        if (deleted) {
            res.json({ message: 'Team member deleted' });
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting team member' });
    }
});

// News endpoints
router.get('/news', (req, res) => {
    try {
        const news = db.getNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news' });
    }
});

router.post('/news', authenticateToken, (req, res) => {
    try {
        const newNews = db.insertOne('news', req.body);
        res.status(201).json(newNews);
    } catch (error) {
        res.status(500).json({ message: 'Error adding news' });
    }
});

router.put('/news/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('news', { id: parseInt(id) }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating news' });
    }
});

router.delete('/news/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const deleted = db.deleteOne('news', { id: parseInt(id) });

        if (deleted) {
            res.json({ message: 'News deleted' });
        } else {
            res.status(404).json({ message: 'News not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news' });
    }
});

// FAQ endpoints
router.get('/faq', (req, res) => {
    try {
        const faq = db.getFAQs();
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching FAQ' });
    }
});

router.post('/faq', authenticateToken, (req, res) => {
    try {
        const newFAQ = db.insertOne('faqs', req.body);
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(500).json({ message: 'Error adding FAQ' });
    }
});

router.put('/faq/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('faqs', { id: parseInt(id) }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating FAQ' });
    }
});

router.delete('/faq/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const deleted = db.deleteOne('faqs', { id: parseInt(id) });

        if (deleted) {
            res.json({ message: 'FAQ deleted' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting FAQ' });
    }
});

// Clients endpoints
router.get('/clients', authenticateToken, (req, res) => {
    try {
        const clients = db.getClients();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients' });
    }
});

router.post('/clients', authenticateToken, (req, res) => {
    try {
        const newClient = db.insertOne('clients', req.body);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Error adding client' });
    }
});

router.put('/clients/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('clients', { id: parseInt(id) }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating client' });
    }
});

router.delete('/clients/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const deleted = db.deleteOne('clients', { id: parseInt(id) });

        if (deleted) {
            res.json({ message: 'Client deleted' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client' });
    }
});

// Inquiries endpoints
router.get('/inquiries', authenticateToken, (req, res) => {
    try {
        const inquiries = db.getInquiries();
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiries' });
    }
});

router.post('/inquiries', (req, res) => {
    try {
        const newInquiry = db.insertOne('inquiries', req.body);
        res.status(201).json(newInquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error adding inquiry' });
    }
});

router.put('/inquiries/:id', authenticateToken, (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updated = db.updateOne('inquiries', { id: parseInt(id) }, updateData);

        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating inquiry' });
    }
});

module.exports = router;