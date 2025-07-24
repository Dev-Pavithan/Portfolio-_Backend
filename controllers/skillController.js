const Skill = require('../models/Skill.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all skills with categories
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = asyncHandler(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({ success: true, data: skills });
});

// @desc    Create new skill category
// @route   POST /api/v1/skills/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  
  let skillDoc = await Skill.findOne();
  if (!skillDoc) {
    skillDoc = await Skill.create({ categories: [] });
  }

  // Check if category already exists
  const categoryExists = skillDoc.categories.some(
    cat => cat.name.toLowerCase() === name.toLowerCase()
  );
  if (categoryExists) {
    return next(new ErrorResponse(`Category ${name} already exists`, 400));
  }

  skillDoc.categories.push({ name, subcategories: [] });
  await skillDoc.save();

  res.status(201).json({ success: true, data: skillDoc });
});

// @desc    Update category
// @route   PUT /api/v1/skills/categories/:categoryId
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  
  const skillDoc = await Skill.findOne();
  if (!skillDoc) {
    return next(new ErrorResponse('Skills document not found', 404));
  }

  const category = skillDoc.categories.id(req.params.categoryId);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  category.name = name;
  await skillDoc.save();

  res.status(200).json({ success: true, data: skillDoc });
});

// @desc    Delete category
// @route   DELETE /api/v1/skills/categories/:categoryId
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const skillDoc = await Skill.findOne();
  if (!skillDoc) {
    return next(new ErrorResponse('Skills document not found', 404));
  }

  const category = skillDoc.categories.id(req.params.categoryId);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  category.remove();
  await skillDoc.save();

  res.status(200).json({ success: true, data: skillDoc });
});

// @desc    Create subcategory in a category
// @route   POST /api/v1/skills/categories/:categoryId/subcategories
// @access  Private/Admin
exports.createSubcategory = asyncHandler(async (req, res, next) => {
  const { name, skills } = req.body;
  
  const skillDoc = await Skill.findOne();
  if (!skillDoc) {
    return next(new ErrorResponse('Skills document not found', 404));
  }

  const category = skillDoc.categories.id(req.params.categoryId);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Check if subcategory already exists
  const subcategoryExists = category.subcategories.some(
    sub => sub.name.toLowerCase() === name.toLowerCase()
  );
  if (subcategoryExists) {
    return next(new ErrorResponse(`Subcategory ${name} already exists in this category`, 400));
  }

  category.subcategories.push({ name, skills });
  await skillDoc.save();

  res.status(201).json({ success: true, data: skillDoc });
});

// @desc    Update subcategory
// @route   PUT /api/v1/skills/categories/:categoryId/subcategories/:subcategoryId
// @access  Private/Admin
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
  const { name, skills } = req.body;
  
  const skillDoc = await Skill.findOne();
  if (!skillDoc) {
    return next(new ErrorResponse('Skills document not found', 404));
  }

  const category = skillDoc.categories.id(req.params.categoryId);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  const subcategory = category.subcategories.id(req.params.subcategoryId);
  if (!subcategory) {
    return next(new ErrorResponse('Subcategory not found', 404));
  }

  if (name) subcategory.name = name;
  if (skills) subcategory.skills = skills;
  
  await skillDoc.save();

  res.status(200).json({ success: true, data: skillDoc });
});

// @desc    Delete subcategory
// @route   DELETE /api/v1/skills/categories/:categoryId/subcategories/:subcategoryId
// @access  Private/Admin
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
  const skillDoc = await Skill.findOne();
  if (!skillDoc) {
    return next(new ErrorResponse('Skills document not found', 404));
  }

  const category = skillDoc.categories.id(req.params.categoryId);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  const subcategory = category.subcategories.id(req.params.subcategoryId);
  if (!subcategory) {
    return next(new ErrorResponse('Subcategory not found', 404));
  }

  subcategory.remove();
  await skillDoc.save();

  res.status(200).json({ success: true, data: skillDoc });
});