const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify Admin JWT
const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false, message: 'Access denied' });

    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

// --- ADMIN ROUTES ---

// Upload Endpoint
app.post('/api/admin/upload', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Unauthorized' });
  jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET, (err) => {
    if (err) return res.status(401).json({ success: false });
    next();
  });
}, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  
  const protocol = req.protocol;
  const host = req.get('host');
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  
  res.json({ success: true, imageUrl });
});

// Get all drafts for version history
app.get('/api/admin/form/config/drafts', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, updated_at, status FROM form_configs ORDER BY updated_at DESC'
        );
        res.json({ success: true, drafts: rows });
    } catch (err) {
        res.status(500).json({ success: true, message: 'Failed to fetch history' });
    }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Admin not found' });

        const admin = rows[0];
        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) return res.status(401).json({ success: false, message: 'Invalid password' });

        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Form Config (Published for Live Site)
app.get('/api/form/config', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM form_configs WHERE status = "published" ORDER BY id DESC LIMIT 1');
        
        let configData = null;
        if (rows.length > 0) {
            configData = typeof rows[0].config_json === 'string' ? JSON.parse(rows[0].config_json) : rows[0].config_json;
        }

        if (!configData) {
            const [drafts] = await pool.execute('SELECT * FROM form_configs ORDER BY id DESC LIMIT 1');
            if (drafts.length === 0) return res.status(404).json({ success: false, message: 'No configuration found' });
            configData = typeof drafts[0].config_json === 'string' ? JSON.parse(drafts[0].config_json) : drafts[0].config_json;
        }
        
        res.json({ success: true, config: configData, version: Date.now() });
    } catch (error) {
        console.error('DATABASE ERROR (GET /api/form/config):', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Get Latest Config (For Admin Dashboard)
app.get('/api/admin/form/config/latest', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM form_configs ORDER BY id DESC LIMIT 1');
        if (rows.length === 0) return res.status(404).json({ success: false });
        const configData = typeof rows[0].config_json === 'string' ? JSON.parse(rows[0].config_json) : rows[0].config_json;
        res.json({ success: true, config: configData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Draft History
app.get('/api/admin/form/config/drafts', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, status, updated_at FROM form_configs ORDER BY id DESC');
        res.json({ success: true, drafts: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Submissions (Admin only)
app.get('/api/admin/submissions', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM form_submissions_v2 ORDER BY created_at DESC');
        res.json({ success: true, submissions: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark Submission as Read
app.put('/api/admin/submissions/:id/read', authenticateAdmin, async (req, res) => {
    try {
        await pool.execute('UPDATE form_submissions_v2 SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save/Publish Config
app.post('/api/admin/form/config', authenticateAdmin, async (req, res) => {
    const { config, status } = req.body;
    try {
        await pool.execute('INSERT INTO form_configs (config_json, status) VALUES (?, ?)', [JSON.stringify(config), status || 'draft']);
        res.json({ success: true, message: `Configuration saved as ${status || 'draft'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Specific Version
app.get('/api/admin/form/config/:id', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM form_configs WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false });
        const configData = typeof rows[0].config_json === 'string' ? JSON.parse(rows[0].config_json) : rows[0].config_json;
        res.json({ success: true, config: configData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- PUBLIC ROUTES ---

// Submit Form
app.post('/api/form/submit', async (req, res) => {
    const { device_info, browser_info, version, ...submissionData } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO form_submissions_v2 (submission_data, form_version, device_info) VALUES (?, ?, ?)',
            [JSON.stringify(submissionData), version || 1, `${device_info} | ${browser_info}`]
        );

        // Add notification
        await pool.execute('INSERT INTO notifications (message) VALUES (?)', [`New partnership request from ${submissionData.organization_name || 'unknown'}`]);

        res.json({ success: true, message: 'Application submitted successfully!', id: result.insertId });
    } catch (error) {
        console.error('Error saving to MySQL:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
