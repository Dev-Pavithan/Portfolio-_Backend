const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: [true, 'Please add the school name']
  },
  period: {
    type: String,
    required: [true, 'Please add the study period']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String
  },
  subjects: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Education', EducationSchema);
