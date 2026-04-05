const express = require('express');
const router = express.Router();
const ProgrammingStat = require('../models/ProgrammingStat');
const authMiddleware = require('../middleware/auth');

// Get all programming statistics
router.get('/', async (req, res) => {
  try {
    const stats = await ProgrammingStat.find().sort({ createdAt: -1 });
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programming stats', error });
  }
});

// Create programming stat (requires auth)
router.post('/', authMiddleware, async (req, res) => {
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
router.put('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await ProgrammingStat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Programming stat not found' });
    res.json({ message: 'Programming stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting programming stat', error });
  }
});

module.exports = router;
