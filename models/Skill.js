const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required']
  },
  subcategories: {
    type: [String],
    required: [true, 'Please add at least one subcategory']
  }
});

const SkillSchema = new mongoose.Schema({
  categories: {
    type: [CategorySchema],
    required: [true, 'Please add at least one category']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', SkillSchema);
