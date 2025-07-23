const Education = require('../models/Education.js');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// Add Education
exports.addEducation = asyncHandler(async (req, res, next) => {
  const edu = await Education.create(req.body);
  res.status(201).json({ success: true, data: edu });
});

// Get all Education
exports.getAllEducation = asyncHandler(async (req, res, next) => {
  const edu = await Education.find();
  res.status(200).json({ success: true, data: edu });
});

// Get Single Education
exports.getEducation = asyncHandler(async (req, res, next) => {
  const edu = await Education.findById(req.params.id);
  if (!edu) return next(new ErrorResponse('Education not found', 404));

  res.status(200).json({ success: true, data: edu });
});

// Update Education
exports.updateEducation = asyncHandler(async (req, res, next) => {
  let edu = await Education.findById(req.params.id);
  if (!edu) return next(new ErrorResponse('Education not found', 404));

  edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: edu });
});

// Delete Education
exports.deleteEducation = asyncHandler(async (req, res, next) => {
  const edu = await Education.findById(req.params.id);
  if (!edu) return next(new ErrorResponse('Education not found', 404));

  await edu.deleteOne();
  res.status(200).json({ success: true, message: 'Education deleted successfully' });
});
