const mongoose = require('mongoose');

const ProgrammingStatSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  icon: { type: String, default: '' },
  rating: { type: String, default: '' },
  rank: { type: String, default: '' },
  solved: { type: String, default: '' },
  contests: { type: String, default: '' },
  profileUrl: { type: String, default: '' },
  color: { type: String, default: '#667eea' },
});

module.exports = mongoose.model('ProgrammingStat', ProgrammingStatSchema);
