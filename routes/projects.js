const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

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

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
});

// Create project (requires auth)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
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
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

module.exports = router;
