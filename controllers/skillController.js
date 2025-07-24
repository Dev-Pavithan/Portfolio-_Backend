const Skill = require('../models/Skill.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Create entire skill document
exports.addSkills = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;

  if (!categories || !Array.isArray(categories)) {
    return next(new ErrorResponse('Categories array is required', 400));
  }

  const skill = await Skill.create({ categories });
  res.status(201).json({ success: true, data: skill });
});

// Get all skill documents
exports.getSkills = asyncHandler(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({ success: true, data: skills });
});

// Update entire skill document
exports.updateSkills = asyncHandler(async (req, res, next) => {
  const { categories } = req.body;
  let skill = await Skill.findById(req.params.id);

  if (!skill) return next(new ErrorResponse('Skills not found', 404));

  skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { categories },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, data: skill });
});

// Delete entire skill document
exports.deleteSkills = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skills not found', 404));

  await skill.deleteOne();
  res.status(200).json({ success: true, message: 'Skills deleted successfully' });
});

// Add a new category to an existing skill document
exports.addCategory = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skill document not found', 404));

  if (!req.body.name || !req.body.subcategories) {
    return next(new ErrorResponse('Category name and subcategories are required', 400));
  }

  skill.categories.push(req.body); // { name, subcategories }
  await skill.save();

  res.status(200).json({ success: true, data: skill });
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skill document not found', 404));

  const category = skill.categories.id(categoryId);
  if (!category) return next(new ErrorResponse('Category not found', 404));

  category.name = req.body.name || category.name;
  category.subcategories = req.body.subcategories || category.subcategories;

  await skill.save();
  res.status(200).json({ success: true, data: skill });
});

// Delete category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skill document not found', 404));

  const category = skill.categories.id(categoryId);
  if (!category) return next(new ErrorResponse('Category not found', 404));

  category.remove();
  await skill.save();

  res.status(200).json({ success: true, message: 'Category deleted', data: skill });
});

// Add subcategory to specific category
exports.addSubcategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { subcategory } = req.body;

  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skill not found', 404));

  const category = skill.categories.id(categoryId);
  if (!category) return next(new ErrorResponse('Category not found', 404));

  category.subcategories.push(subcategory);
  await skill.save();

  res.status(200).json({ success: true, data: skill });
});

// Delete subcategory
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subcategoryIndex } = req.params;

  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skill not found', 404));

  const category = skill.categories.id(categoryId);
  if (!category) return next(new ErrorResponse('Category not found', 404));

  category.subcategories.splice(subcategoryIndex, 1);
  await skill.save();

  res.status(200).json({ success: true, data: skill });
});
