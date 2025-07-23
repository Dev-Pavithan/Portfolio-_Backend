const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [200, 'Project title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a project description']
  },
  image: {
    type: String,
    required: [true, 'Please upload a project image']
  },
  source: {
    type: String,
    trim: true,
    required: [true, 'Please add a project source']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
