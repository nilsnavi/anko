const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload single image
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileInfo = {
            id: req.file.filename,
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadDate: new Date()
        };

        res.status(201).json({
            message: 'File uploaded successfully',
            file: fileInfo
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

// Upload multiple images
router.post('/upload-multiple', authenticateToken, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const filesInfo = req.files.map(file => ({
            id: file.filename,
            originalName: file.originalname,
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadDate: new Date()
        }));

        res.status(201).json({
            message: `${req.files.length} files uploaded successfully`,
            files: filesInfo
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

// Get all uploaded files
router.get('/files', authenticateToken, (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const filesInfo = files
            .filter(file => !file.startsWith('.')) // Skip hidden files
            .map(file => {
                const filePath = path.join(uploadDir, file);
                const stat = fs.statSync(filePath);
                return {
                    id: file,
                    filename: file,
                    path: `/uploads/${file}`,
                    size: stat.size,
                    uploadDate: stat.birthtime
                };
            })
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)); // Sort by newest first

        res.json(filesInfo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to list files', error: error.message });
    }
});

// Delete file
router.delete('/files/:filename', authenticateToken, (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete file', error: error.message });
    }
});

// Serve uploaded files statically
router.use('/uploads', express.static(uploadDir));

module.exports = router;