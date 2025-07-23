const mongoose = require('mongoose');

const WorkExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  period: {
    type: String,
    required: [true, 'Please add a period']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkExperience', WorkExperienceSchema);
