const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subcategory name']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  }
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true
  },
  subcategories: [SubcategorySchema]
}, { _id: true });

const SkillSchema = new mongoose.Schema({
  categories: [CategorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', SkillSchema);