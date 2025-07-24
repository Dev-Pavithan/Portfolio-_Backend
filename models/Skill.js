const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  technical: {
    type: [String],
    required: [true, 'Please add at least one technical skill']
  },
  interpersonal: {
    type: [String],
    required: [true, 'Please add at least one interpersonal skill']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', SkillSchema);
