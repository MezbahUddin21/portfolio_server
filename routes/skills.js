const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
});


// Add or update skills
router.post('/', async (req, res) => {
  try {
    const { category, skills } = req.body;

    if (!category || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Category and skills array are required' });
    }

    // Check if category exists
    let existingSkill = await Skill.findOne({ category });

    if (existingSkill) {
      existingSkill.skills = skills;
      await existingSkill.save();
      res.json({ message: 'Skills updated successfully', skill: existingSkill });
    } else {
      const newSkill = new Skill({ category, skills });
      await newSkill.save();
      res.status(201).json({ message: 'Skills added successfully', skill: newSkill });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving skills', error });
  }
});

// Update skills
router.put('/:id', async (req, res) => {
  try {
    const { category, skills } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, { category, skills }, { new: true });
    res.json({ message: 'Skills updated successfully', skill: updatedSkill });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills', error });
  }
});

// Delete skills
router.delete('/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skills deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skills', error });
  }
});

module.exports = router;