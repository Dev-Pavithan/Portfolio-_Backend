const WorkExperience = require('../models/WorkExperience.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Add Work Experience
exports.addWorkExperience = asyncHandler(async (req, res, next) => {
  const work = await WorkExperience.create(req.body);
  res.status(201).json({ success: true, data: work });
});

// Get all Work Experiences
exports.getAllWorkExperiences = asyncHandler(async (req, res, next) => {
  const work = await WorkExperience.find();
  res.status(200).json({ success: true, data: work });
});

// Get Single Work Experience
exports.getWorkExperience = asyncHandler(async (req, res, next) => {
  const work = await WorkExperience.findById(req.params.id);
  if (!work) return next(new ErrorResponse('Work experience not found', 404));

  res.status(200).json({ success: true, data: work });
});

// Update Work Experience
exports.updateWorkExperience = asyncHandler(async (req, res, next) => {
  let work = await WorkExperience.findById(req.params.id);
  if (!work) return next(new ErrorResponse('Work experience not found', 404));

  work = await WorkExperience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: work });
});

// Delete Work Experience
exports.deleteWorkExperience = asyncHandler(async (req, res, next) => {
  const work = await WorkExperience.findById(req.params.id);
  if (!work) return next(new ErrorResponse('Work experience not found', 404));

  await work.deleteOne();
  res.status(200).json({ success: true, message: 'Work experience deleted successfully' });
});
