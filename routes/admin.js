const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const ProgrammingStat = require('../models/ProgrammingStat');
const Highlights = require('../models/Highlights');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1d';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register a new admin
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }


  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registration successful',
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error });
  }
});

// Login an admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// ====================== Project Admin Routes ======================

// Create project (requires auth)
router.post('/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, liveLink, githubLink } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? JSON.parse(technologies)
      : [];

    const newProject = new Project({
      title,
      description,
      image: req.file ? req.file.filename : null,
      technologies: technologiesArray,
      liveLink: liveLink || '',
      githubLink: githubLink || '',
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Update project (requires auth)
router.put('/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, technologies, liveLink, githubLink } = req.body;
    const updateData = {
      title: title || undefined,
      description: description || undefined,
      liveLink: liveLink || undefined,
      githubLink: githubLink || undefined,
    };

    if (technologies) {
      updateData.technologies = Array.isArray(technologies)
        ? technologies
        : typeof technologies === 'string'
        ? JSON.parse(technologies)
        : [];
    }

    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete project (requires auth)
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

// ====================== Programming Stats Admin Routes ======================

// Create programming stat (requires auth)
router.post('/programming', authMiddleware, async (req, res) => {
  try {
    const { platform, icon, rating, rank, solved, contests, profileUrl, color } = req.body;

    if (!platform) {
      return res.status(400).json({ message: 'Platform name is required' });
    }

    const newStat = new ProgrammingStat({
      platform,
      icon: icon || '💻',
      rating: rating || 0,
      rank: rank || '',
      solved: solved || 0,
      contests: contests || 0,
      profileUrl: profileUrl || '',
      color: color || '#6366f1',
    });

    await newStat.save();
    res.status(201).json(newStat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating programming stat', error });
  }
});

// Update programming stat (requires auth)
router.put('/programming/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await ProgrammingStat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Programming stat not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating programming stat', error });
  }
});

// Delete programming stat (requires auth)
router.delete('/programming/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await ProgrammingStat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Programming stat not found' });
    res.json({ message: 'Programming stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting programming stat', error });
  }
});

// ====================== Highlights Ad min Routes ======================

// Create highlight (requires auth)
router.post('/highlights', authMiddleware, async (req, res) => {
  try {
    const { highlights } = req.body;
    if (!highlights) {
      return res.status(400).json({ message: 'Highlight text is required' });
    }
    const newHighlight = new Highlights({ highlights });
    await newHighlight.save();
    res.status(201).json(newHighlight);
  } catch (error) {
    res.status(500).json({ message: 'Error creating highlight', error });
  }
});

// Update highlight (requires auth)
router.put('/highlights/:id', authMiddleware, async (req, res) => {
  try {
    const { highlights } = req.body;
    const updated = await Highlights.findByIdAndUpdate(
      req.params.id,
      { highlights },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Highlight not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating highlight', error });
  }
});

// Delete highlight (requires auth)
router.delete('/highlights/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Highlights.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Highlight not found' });
    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting highlight', error });
  }
});

module.exports = router;
