const Skill = require('../models/Skill.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Add Skills
exports.addSkills = asyncHandler(async (req, res, next) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// Get all Skills
exports.getSkills = asyncHandler(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({ success: true, data: skills });
});

// Update Skills
exports.updateSkills = asyncHandler(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skills not found', 404));

  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: skill });
});

// Delete Skills
exports.deleteSkills = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return next(new ErrorResponse('Skills not found', 404));

  await skill.deleteOne();
  res.status(200).json({ success: true, message: 'Skills deleted successfully' });
});
