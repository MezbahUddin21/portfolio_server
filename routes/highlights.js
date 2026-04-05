const express = require('express');
const router = express.Router();
const Highlights = require('../models/Highlights');
const authMiddleware = require('../middleware/auth');

// Get all highlights
router.get('/', async (req, res) => {
  try {
    const highlights = await Highlights.find().sort({ createdAt: -1 });
    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highlights', error });
  }
});

// Create highlight (requires auth)
router.post('/', authMiddleware, async (req, res) => {
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
router.put('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Highlights.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Highlight not found' });
    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting highlight', error });
  }
});

module.exports = router;
