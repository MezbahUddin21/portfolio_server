const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: '' },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
